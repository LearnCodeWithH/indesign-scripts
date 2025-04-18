//ExportPagesToEditablePsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#target indesign
#include './lib/bridgetalk/BridgeTalk.jsx'
#include './lib/Validations.jsx'
#include './lib/Graphics.jsx'
#include './lib/Datetime.jsx'
#include './lib/Text.jsx'

// Config must be fed from ID side script as PS does not have access to read files ID has access to.
#include './config/ImportPdfAndExportPages.config.js';

main();
function main() {
    scriptRunScope(function() {
        requireDocument();
        requirePage(app.activeDocument);

        var active_doc = app.activeDocument;

        transientDocumentScope(active_doc, function(doc) {
            var currentPage = doc.layoutWindows[0].activePage;
            // var pages = [currentPage];
            var pages = doc.pages;
            var result = splitTextAndContentLayers(doc, doc.layers, pages);
            var textLayers = result[0];
            var contentLayers = result[1];
            
            var layerInfo = [];
            for (var i = 0; i < doc.layers.length; i++) {
                layerInfo.push({});
            }

            var default_folder_location = doc.filePath.parent;
            var pdf_export_folder = requireSelectFolderViaDialogue("Choose a folder location to save output Psd files.", default_folder_location);
            
            // Create Pages directory and subdirectories for each page
            var pages_folder = new Folder(pdf_export_folder + "/Pages");
            if (!pages_folder.exists) {
                pages_folder.create();
            }
            var page_numbers = map(pages, function(page) {
                return page.name;
            });
            
            var page_folders = map(pages, function(page) {
                var page_num = page.name;
                var page_folder = new Folder(pages_folder + "/" + page_num);
                if (!page_folder.exists) {
                    page_folder.create();
                }
                return page_folder;
            });

            // Sets dialog to first preset.
            var export_preset = app.pdfExportPresets[0];
            // Duplicate the preset and modify it for single page export
            var modified_preset = export_preset.duplicate();
            modified_preset.exportAsSinglePages = false;
            modified_preset.singlePagesPDFSuffix = "";
            setLosslessPdfPreset(modified_preset);

            // Get InDesign file name without extension for PDF naming
            var docName = doc.name;
            if (docName.lastIndexOf(".") != -1) {
                docName = docName.substring(0, docName.lastIndexOf("."));
            }

            var globalPdfExport = app.interactivePDFExportPreferences;
            globalPdfExport.exportAsSinglePages = false;
            globalPdfExport.singlePagesPDFSuffix = "";

            var doSkipFilterChecks = false;
            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (!any(contentLayers, function(l) { return l === layer; })) {
                    continue; // Skip if not a content layer
                }
                var layerOrderNumber = zeroPadNumber((i + 1).toString(), 4);

                // Make only this layer visible
                disableAllOtherLayers(doc, layer);

                var page_save_files = [];
                for (var j = 0; j < page_folders.length; j++) {
                    // Need to include at least one content layer for pixel dimensions.
                    // Past that, we can check if there are any items that would be exported to the Pdf and skip accordingly.
                    if (doSkipFilterChecks && !hasContentForPage(layer, pages[j])) {
                        continue; // Skip if no content on this page
                    }

                    var page_folder = page_folders[j];
                    
                    var pdfFileName = docName + "_layer-" + layerOrderNumber;
                    
                    var pdf_save_file = new File(page_folder + "/" + pdfFileName + ".pdf");
                    page_save_files[j] = pdf_save_file;

                    globalPdfExport.pageRange = (j + 1).toString(); // Set the page range for export
                    doc.exportFile(ExportFormat.INTERACTIVE_PDF, pdf_save_file, false, modified_preset);
                }

                doSkipFilterChecks = true;

                var pageInfo = [];
                for (var j = 0; j < page_save_files.length && j < page_numbers.length; j++) {
                    var pdfPageFile = page_save_files[j];
                    pageInfo.push({
                        pageNumber: page_numbers[j],
                        pdfFileName: pdfPageFile.name,
                        pdfFullFilePath: pdfPageFile.fullName,
                    });
                }
            
                // Store content layer info for Photoshop processing
                layerInfo[i] = {
                    name: layer.name,
                    layerType: "content",
                    orderIndex: i,
                    pageInfo: pageInfo
                };
            }

            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (!any(textLayers, function(l) { return l === layer; })) {
                    continue; // Skip if not a text layer
                }

                var textFramesByPage = getTextFramesFromLayerByPages(layer, pages);

                var pageTextInfo = map(page_numbers, function(pageNumber) {
                    var textFrames = textFramesByPage[pageNumber];
                    var textData = parseTextDataFromTextFrames(textFrames);
                    return {
                        pageNumber: pageNumber,
                        textData: textData
                    };
                });

                // Store text layer info for Photoshop processing
                layerInfo[i] = {
                    name: layer.name,
                    layerType: "text",
                    orderIndex: i,
                    pageTextInfo: pageTextInfo
                };
            }

            DebugLogger.writeObject("layerInfo => ", layerInfo);

            // Clean up the duplicate preset
            modified_preset.remove();
            
            processPhotoshopScript(doc, layerInfo, pages);
        });
    });
}

function splitTextAndContentLayers(doc, layers, pages) {
    // Hold layers to be processed since document layers will be added to.
    var processLayers = filter(layers, function(layer) {
        return layer.visible && !layer.locked;
    });

    var contentLayerNames = map(processLayers, function(layer) {
        return layer.name;
    });

    var textLayerNames = map(contentLayerNames, function(name) {
        var layer = layers.itemByName(name);
        // Move text frames to their own layer
        var newTextLayer = moveTextToOwnLayer(doc, layer, pages);
        return newTextLayer.name;
    });

    // The layers seem to be replace inline as doing this by index ends up with duplicate layer names.
    // Save yourself headache and use layer names to get the layers if you're adding additional layers.
    var contentLayers = map(contentLayerNames, function(name) {
        var layer = layers.itemByName(name);
        return layer;
    });
    
    var textLayers = map(textLayerNames, function(name) {
        var layer = layers.itemByName(name);
        return layer;
    });
    
    return [textLayers, contentLayers];
}

function hasTextFramesForPage(layer, page) {
    if (!layer.visible || layer.locked) {
        return false;
    }
    
    return any(page.textFrames, function(frame) {
        return frame.itemLayer === layer;
    });
}

function hasContentForPage(layer, page) {
    if (!layer.visible || layer.locked) {
        return false;
    }
    
    // Check for any page items on this page from this layer that are not text frames
    return any(page.pageItems, function(item) {
        return item.itemLayer === layer && !(item instanceof TextFrame);
    });
}

function processPhotoshopScript(doc, layerInfo, pages) {
    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.
    var photoshop_lib_script_path = script_path + "/lib/bridgetalk/PhotoshopText.jsx"
    var photoshop_file_script = readFileForScript(photoshop_lib_script_path);

    var file_lib_script_path = script_path + "/lib/File.jsx"
    var file_file_script = readFileForScript(file_lib_script_path);

    var datetime_lib_script_path = script_path + "/lib/Datetime.jsx"
    var datetime_file_script = readFileForScript(datetime_lib_script_path);

    var rgbProf = doc.rgbProfile;
    var color_profile = rgbProf;

    var import_pdf_options_symbol = anonymousHashSymbol([]);
    
    // Add function call with data
    var layer_info_hash = anonymousHashArraySymbol(layerInfo);
    DebugLogger.writeObject("layer_info_hash => ", layer_info_hash);
    var args_symbol_array = [
        import_pdf_options_symbol, 
        stringSymbol(color_profile),
        layer_info_hash
    ];
    DebugLogger.writeObject("args_symbol_array => ", args_symbol_array);
    var ps_script_call = buildFunctionCallForScript("createTextLayersFromData", args_symbol_array);

    // Send to Photoshop
    var full_script_text = stitchScripts([
        datetime_file_script, 
        file_file_script, 
        photoshop_file_script, 
        ps_script_call
        ]);

    DebugLogger.write("full_script_text => \n" + full_script_text);
    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAndExportPages.config.js'
    if (included_config["write_debug_bridgetalk_script"] === true) {
        outputStitchedScript(full_script_text, doc.filePath);
    }

    // sendScriptToPhotoshop(full_script_text);
}
