//ExportPagesToEditablePsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#target indesign
#include './lib/bridgetalk/BridgeTalkScript.jsx'
#include './lib/jam/jamJSON.jsxinc'
#include './lib/Validations.jsx'
#include './lib/Functional.jsx'
#include './lib/Graphics.jsx'
#include './lib/Datetime.jsx'
#include './lib/Text.jsx'
#include './lib/DebugFileLogger.jsx'

// Config must be fed from ID side script as PS does not have access to read files ID has access to.
#include './config/ImportPdfAndExportPages.config.js';

scriptRunScope(main, true);
function main() {
    requireDocument();
    requirePage(app.activeDocument);

    transientDocumentScope(app.activeDocument, function(doc) {
        var pages = [ doc.layoutWindows[0].activePage ];
        // var pages = doc.pages;
        var result = splitTextAndContentLayersOrdered(doc, doc.layers, pages);
        var textLayersOrdered = result[0];
        var contentLayersOrdered = result[1];
        
        var default_folder_location = doc.filePath.parent;
        var user_export_folder = requireSelectFolderViaDialogue("Choose a folder location to save output Psd files.", default_folder_location);
        
        var modified_preset = getPdfExportPresetFromApp();
        
        var pageInfoByPageNum = {};
        // Create Pages directory and subdirectories for each page
        usingFolder(new Folder(user_export_folder + "/Pages"), function(pages_folder) {
            for (var i = 0; i < pages.length; i++) {
                var page_num = pages[i].name;
                usingFolder(new Folder(pages_folder + "/" + page_num), function(folder) {
                    pageInfoByPageNum[page_num] = {
                        pageNumber: page_num,
                        pageFolderPath: folder.fullName,
                        firstContentLayer: null,
                        layerInfoOrdered: []
                    };
                });
            }

            // Each page contains at least one content layer for pixel dimensions.
            var contentLayerInfoByPageNum = exportContentLayersToInfo(doc, contentLayersOrdered, pages, pageInfoByPageNum);

            var textLayerInfoByPageNum = exportTextLayersToInfo(doc, textLayersOrdered, pages, pageInfoByPageNum);

            exportContentLayerInfoToPdf(doc, modified_preset, contentLayerInfoByPageNum);

            // Add first content layer and all layer info ordered by index.
            for (var pageNum in pageInfoByPageNum) {
                var contentLayerInfo = contentLayerInfoByPageNum[pageNum];
                var textLayerInfo = textLayerInfoByPageNum[pageNum] || [];
                var pageInfo = pageInfoByPageNum[pageNum];

                pageInfo.firstContentLayer = contentLayerInfo[0];
                pageInfo.layerInfoOrdered = order_by_index(contentLayerInfo.concat(textLayerInfo), true);
            }
        });

        // Clean up the duplicate preset
        modified_preset.remove();

        DebugLogger.writeObject("pageInfoByPageNum => ", pageInfoByPageNum);

        processPhotoshopScript(doc, pageInfoByPageNum, user_export_folder);
    });
}

function splitTextAndContentLayersOrdered(doc, layers, pages) {
    // Doc layers are in order from top to bottom.
    var processLayers = filter(layers, function(layer) {
        return layer.visible && !layer.locked;
    });

    var contentLayerNames = map(processLayers, function(layer) {
        return layer.name;
    });

    var maybeTextLayerNames = map(contentLayerNames, function(name) {
        var layer = layers.itemByName(name);
        // Move text frames to their own layer
        var newTextLayer = moveTextToOwnLayer(doc, layer, pages);
        return newTextLayer !== null ? newTextLayer.name : null;
    });

    var textLayerNames = filter(maybeTextLayerNames, function(name) {
        return name !== null;
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
    
    return [order_by_index(textLayers, true), order_by_index(contentLayers, true)];
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

function getPdfExportPresetFromApp() {
    // Sets dialog to first preset.
    var export_preset = app.pdfExportPresets[0];
    // Duplicate the preset and modify it for single page export
    var modified_preset = export_preset.duplicate();
    modified_preset.exportAsSinglePages = false;
    modified_preset.singlePagesPDFSuffix = "";
    setLosslessPdfPreset(modified_preset);
    return modified_preset;
}

function exportContentLayersToInfo(doc, contentLayersOrdered, pages, pageInfoByPageNum) {
    // Get InDesign file name without extension for PDF naming
    var docName = doc.name;
    if (docName.lastIndexOf(".") != -1) {
        docName = docName.substring(0, docName.lastIndexOf("."));
    }

    var contentLayerInfoByPageNum = {};
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        // Data Shape:
        // {
        //     pageNumber: page_num,
        //     pageFolderPath: folder.fullName,
        //     firstContentLayer: null,
        //     layerInfo: []
        // }
        var pageInfo = pageInfoByPageNum[page.name];

        var layerInfo = [];
        var doSkipFilterChecks = false;
        for (var j = 0; j < contentLayersOrdered.length; j++) {
            var layer = contentLayersOrdered[j];
            var layerOrderNumber = zeroPadNumber((layer.index).toString(), 4);

            // Need to include at least one content layer for pixel dimensions.
            // Past that, we can check if there are any items that would be exported to the Pdf and skip accordingly.
            if (doSkipFilterChecks && !hasContentForPage(layer, page)) {
                continue; // Skip if no content on this page
            }
            doSkipFilterChecks = true;
            
            var pdfFileName = docName + "_layer-" + layerOrderNumber;
            var pdfSaveFile = new File(pageInfo.pageFolderPath + "/" + pdfFileName + ".pdf");
        
            // Store content layer info for Photoshop processing
            layerInfo.push({
                name: layer.name,
                layerType: "content",
                index: layer.index,
                pdfFileName: pdfSaveFile.name,
                pdfFullFilePath: pdfSaveFile.fullName
            });
        }

        contentLayerInfoByPageNum[page.name] = layerInfo;
    }

    return contentLayerInfoByPageNum;
    
}

function exportContentLayerInfoToPdf(doc, pdfExportPreset, contentLayerInfoByPageNum) {
    var globalPdfExport = app.interactivePDFExportPreferences;
    globalPdfExport.exportAsSinglePages = false;
    globalPdfExport.singlePagesPDFSuffix = "";

    for (var pageNum in contentLayerInfoByPageNum) {
        // Data Shape:
        // {
        //     name: layer.name,
        //     layerType: "content",
        //     index: layer.index,
        //     pdfFileName: pdfSaveFile.name,
        //     pdfFullFilePath: pdfSaveFile.fullName
        // }
        var layerInfo = contentLayerInfoByPageNum[pageNum];
        each(layerInfo, function(info) {
            var layer = doc.layers.itemByName(info.name);
            
            // Make only this layer visible
            disableAllOtherLayers(doc, layer);

            var pdfSaveFile = new File(info.pdfFullFilePath);

            globalPdfExport.pageRange = pageNum; // Set the page range for export
            doc.exportFile(ExportFormat.INTERACTIVE_PDF, pdfSaveFile, false, pdfExportPreset);
        });
    }
}

function exportTextLayersToInfo(doc, textLayersOrdered, pages, pageInfoByPageNum) {
    // Get InDesign file name without extension for JSON naming
    var docName = doc.name;
    if (docName.lastIndexOf(".") != -1) {
        docName = docName.substring(0, docName.lastIndexOf("."));
    }

    var textLayerInfoByPageNum = {};
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        // Data Shape:
        // {
        //     pageNumber: page_num,
        //     pageFolderPath: folder.fullName,
        //     firstContentLayer: null,
        //     layerInfo: []
        // }
        var pageInfo = pageInfoByPageNum[page.name];

        var layerInfo = [];
        for (var j = 0; j < textLayersOrdered.length; j++) {
            var layer = textLayersOrdered[j];
            var layerOrderNumber = zeroPadNumber((layer.index).toString(), 4);
            
            var textFramesByPage = getTextFramesFromLayerByPages(layer, [page]);

            var textFrames = textFramesByPage[page.name];
            if (textFrames.length === 0) {
                continue; // Skip if no text on this page for layer
            }
            var textData = parseTextDataFromTextFrames(doc, textFrames);

            var jsonFileName = docName + "_text-layer-" + layerOrderNumber;
            var jsonSaveFile = new File(pageInfo.pageFolderPath + "/" + jsonFileName + ".json");

            usingFile(jsonSaveFile, "w", function(jsonFile) {
                jsonFile.write(JSON.stringify(textData, null, 4)); 
            });
        
            // Store content layer info for Photoshop processing
            layerInfo.push({
                name: layer.name,
                layerType: "text",
                index: layer.index,
                jsonFileName: jsonSaveFile.name,
                jsonFullFilePath: jsonSaveFile.fullName
            });
        }

        textLayerInfoByPageNum[page.name] = layerInfo;
    }

    return textLayerInfoByPageNum;
}

function processPhotoshopScript(doc, pageInfoByPageNum, user_export_folder) {
    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.

    var rgbProf = doc.rgbProfile;
    var color_profile = rgbProf;

    var bt_script = createBridgeTalkScript();

    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAndExportPages.config.js'
    
    bt_script
        .addFile(script_path + "/lib/Datetime.jsx")
        .addFile(script_path + "/lib/File.jsx")
        .addFile(script_path + "/lib/Functional.jsx")
        // TODO: REMOVE when ready for production
        .addFile(script_path + "/lib/DebugFileLogger.jsx")
        .addFile(script_path + "/lib/bridgetalk/PSPdfImport.jsx")
        .addFile(script_path + "/lib/bridgetalk/PSConversions.jsx")
        .addFile(script_path + "/lib/jam/jamEngine.jsxinc")
        .addFile(script_path + "/lib/jam/jamUtils.jsxinc")
        .addFile(script_path + "/lib/jam/jamHelpers.jsxinc")
        .addFile(script_path + "/lib/jam/jamText.jsxinc")
        .addFile(script_path + "/lib/jam/jamJSON.jsxinc")
        .addFile(script_path + "/lib/bridgetalk/BuildPsdFromPdfPSEntrypoint.jsx")
        .addFunctionCall("createTextLayersFromData", function(symbolBuilder) {
            var import_pdf_options_symbol = {};
            // NOTE: If we wanted to bring back the pdf import config part. Uncomment
            // var import_pdf_options_symbol = symbolBuilder.encodeAnonymousHash(
            //     included_config, 
            //     ["color_mode", "dpi_res", "anti_alias"]);

            return [
                symbolBuilder.buildValue(import_pdf_options_symbol),
                symbolBuilder.buildValue(color_profile),
                symbolBuilder.buildValue(pageInfoByPageNum),
                symbolBuilder.buildValue(user_export_folder.fullName)
            ];
        });

    if (included_config["write_debug_bridgetalk_script"] === true) {
        bt_script.outputToFile(doc.filePath + "/stitched_script.jsx");
    }

    // TODO: Bridgetalk has a different output than the written script, layer names have 're put everywhere.
    // TODO: Remove when ready for production
    // bt_script.sendToPhotoshop();
}
