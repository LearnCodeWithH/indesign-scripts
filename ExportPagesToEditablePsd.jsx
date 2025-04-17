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

        var doc = app.activeDocument;

        transientDocumentScope(doc, function(doc) {
            var currentPage = doc.layoutWindows[0].activePage;
            // var pages = [currentPage];
            var pages = doc.pages;
            var result = splitTextAndContentLayers(doc.layers, pages);
            var textLayers = result[0];
            var contentLayers = result[1];
            
            var layerInfo = [];
            for (var i = 0; i < doc.layers.length; i++) {
                layerInfo.push({});
            }

            var default_file_location = doc.filePath;
            var user_save_file = requireSaveFileViaDialogue("Choose a location to save to Pdf.", "Pdf files:*.pdf", default_file_location);

            // user_save_file has the file path
            // /c/Program%20Files/Adobe/Adobe%20InDesign%20CC%202018/Resources/Adobe%20PDF/settings/mul/High%20Quality%20Print.joboptions
            var pdf_export_folder = new Folder(user_save_file.path);
            
            // Create Pages directory and subdirectories for each page
            var pages_folder = new Folder(pdf_export_folder + "/Pages");
            if (!pages_folder.exists) {
                pages_folder.create();
            }
            
            // Create numbered page subdirectories
            for (var p = 0; p < pages.length; p++) {
                var page_num = pages[p].name;
                var page_folder = new Folder(pages_folder + "/" + page_num);
                if (!page_folder.exists) {
                    page_folder.create();
                }
            }

            // Sets dialog to first preset.
            var export_preset = app.pdfExportPresets[0];
            // Duplicate the preset and modify it for single page export
            var modified_preset = export_preset.duplicate();
            modified_preset.exportAsSinglePages = true;
            modified_preset.singlePagesPDFSuffix = "_^P"; // _^P is the default suffix for single page exports in InDesign. This is used to identify the pages in the PDF file names.
            setLosslessPdfPreset(modified_preset);
            DebugLogger.writeObject("modified_preset => ", modified_preset, 2);
            DebugLogger.writeObject("modified_preset file => ", modified_preset.fullName, 2);

            // Get InDesign file name without extension for PDF naming
            var docName = doc.name;
            if (docName.lastIndexOf(".") != -1) {
                docName = docName.substring(0, docName.lastIndexOf("."));
            }

            DebugLogger.writeObject("Doc layers => ", doc.layers, 2);
            var initial_pdf_file = null;
            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (!any(contentLayers, function(l) { return l === layer; })) {
                    continue; // Skip if not a content layer
                }
                var layerOrderNumber = zeroPadNumber((i + 1).toString(), 4);
                var pdfFileName = docName + "_layer-" + layerOrderNumber;

                // Make only this layer visible
                disableAllOtherLayers(doc, layer);
                
                // Export the PDF
                var pdf_save_file = new File(pdf_export_folder + "/" + pdfFileName + ".pdf");
                // TODO: Save as pages gives the filename without .pdf as a folder and saves the pages in that folder.
                // Format is "Flow_01.pdf" for "_^P" suffix.
                doc.exportFile(ExportFormat.INTERACTIVE_PDF, pdf_save_file, false, modified_preset);
                
                if (initial_pdf_file == null) {
                    initial_pdf_file = pdf_save_file.fullName; // Store the first PDF file
                }

                // Store layer info for Photoshop processing
                layerInfo[i] = {
                    name: layer.name,
                    layerType: "content",
                    orderIndex: i,
                    pdfFileName: pdfFileName + ".pdf",
                    pdfFileFullPath: pdf_save_file.fullName
                };
                
                // Move single page PDFs to their respective page folders
                // Check if there are multiple pages in the PDF
                // TODO: Single pages are already under the folders, rework this
                var pageCount = getPdfPageCount(pdf_save_file);
                if (pageCount > 0) {
                    // Move PDF files to appropriate page folders
                    for (var j = 0; j < pageCount; j++) {
                        // The page number in the file name (1-based)
                        var pageIndex = j + 1;
                        // Find the corresponding page to get the correct folder name
                        var pageNumber = (j < pages.length) ? pages[j].name : pageIndex.toString();
                        var pageFolderPath = pages_folder + "/" + pageNumber;
                        
                        // Original single page PDF file (created by exportAsSinglePages = true)
                        var singlePageFile = new File(pdf_export_folder + "/" + pdfFileName + "_" + pageIndex + ".pdf");
                        
                        // Move to the appropriate page folder if it exists
                        if (singlePageFile.exists) {
                            var destinationFile = new File(pageFolderPath + "/" + pdfFileName + "_" + pageIndex + ".pdf");
                            singlePageFile.copy(destinationFile);
                            singlePageFile.remove();
                        }
                    }
                }
            }

            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (!any(textLayers, function(l) { return l === layer; })) {
                    continue; // Skip if not a text layer
                }

                var textFrames = getTextFramesFromLayer(layer, pages);
                var textData = parseTextDataFromTextFrames(textFrames);

                layerInfo[i] = {
                    name: layer.name,
                    layerType: "text",
                    orderIndex: i,
                    textData: textData
                };
            }

            DebugLogger.write("textData => " + textData.length + " items");

            // Clean up the duplicate preset
            modified_preset.remove();
            
            // processPhotoshopScript(doc, layerInfo, pages, initial_pdf_file);
        });
    });
}

function splitTextAndContentLayers(layers, pages) {
    var textLayers = [];
    var contentLayers = [];

    // Hold layers to be processed since document layers will be added to.
    var processLayers = [];
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        // Skip hidden or locked layers
        if (!layer.visible || layer.locked) {
            continue;
        }
        processLayers.push(layer);
    }
    
    // Process each layer
    for (var i = 0; i < processLayers.length; i++) {
        var layer = processLayers[i];
        
        // Add current layer to content layers
        contentLayers.push(layer);
        
        // Move text frames to their own layer
        var newTextLayer = moveTextToOwnLayer(layer, pages);
        textLayers.push(newTextLayer);
    }
    
    return [textLayers, contentLayers];
}

function processPhotoshopScript(doc, layerInfo, pages, initialPdfFile) {
    // Import the pdf files into Photoshop
    // Make a photoshop layer for each pdf and order the layers
    // Make a layer group representing the text frame layer
    // Import the text frame data from the layer and put the text layer in the appropriate text layer group.

    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.
    var photoshop_lib_script_path = script_path + "/lib/bridgetalk/PhotoshopText.jsx"
    var photoshop_file_script = readFileForScript(photoshop_lib_script_path);

    var file_lib_script_path = script_path + "/lib/File.jsx"
    var file_file_script = readFileForScript(file_lib_script_path);

    var datetime_lib_script_path = script_path + "/lib/Datetime.jsx"
    var datetime_file_script = readFileForScript(datetime_lib_script_path);

    var rgbProf = active_doc.rgbProfile;
    var color_profile = rgbProf;

    var import_pdf_options_symbol = anonymousHashSymbol([]);
    
    // Add function call with data
    var layer_info_hash = anonymousHashArraySymbol(layerInfo);
    DebugLogger.writeObject("layer_info_hash => ", layer_info_hash);
    var args_symbol_array = [
        stringSymbol(initialPdfFile),
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
