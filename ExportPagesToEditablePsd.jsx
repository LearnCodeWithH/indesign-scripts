//ExportPagesToEditablePsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#target indesign
#include './lib/bridgetalk/BridgeTalk.jsx'
#include './lib/Datetime.jsx'
#include './lib/Functional.jsx';
#include './lib/File.jsx'
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
            var pages = [currentPage];
            // var pages = doc.pages;
            var [textLayers, contentLayers] = splitTextAndContentLayers(doc.layers, pages);
            
            var layerInfo = [];
            for (var i = 0; i < doc.layers.length; i++) {
                layerInfo.push({});
            }

            var default_file_location = doc.filePath;
            var user_save_file = requireSaveFileViaDialogue("Choose a location to save to Pdf.", "Pdf files:*.pdf", default_file_location);

            // user_save_file has the file path
            // /c/Program%20Files/Adobe/Adobe%20InDesign%20CC%202018/Resources/Adobe%20PDF/settings/mul/High%20Quality%20Print.joboptions
            var pdf_export_folder = new Folder(user_save_file.path);

            // Sets dialog to first preset.
            var export_preset = app.pdfExportPresets[0];

            // Get InDesign file name without extension for PDF naming
            var docName = doc.name;
            if (docName.lastIndexOf(".") != -1) {
                docName = docName.substring(0, docName.lastIndexOf("."));
            }

            var initial_pdf_file = null;
            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (contentLayers.indexOf(layer) === -1) {
                    continue; // Skip if not a content layer
                }
                var layerOrderNumber = (i + 1).toString().padStart(4, "0"); // Format as 0001, 0002, etc.
                var pdfFileName = docName + "_layer-" + layerOrderNumber;

                // Make only this layer visible
                disableAllOtherLayers(doc, layer);
                
                // Export the PDF
                var pdf_save_file = new File(pdf_export_folder + "/" + pdfFileName + ".pdf");
                doc.exportFile(ExportFormat.INTERACTIVE_PDF, pdf_save_file, true, export_preset);
                
                if (initial_pdf_file == null) {
                    initial_pdf_file = pdf_save_file.fullName; // Store the first PDF file
                }

                // Store layer info for Photoshop processing
                layerInfo[i] = {
                    name: layer.name,
                    layerType: "content",
                    orderIndex: i,
                    pdfFileName: pdfFileName + ".pdf"
                    pdfFileFullPath: pdf_save_file.fullName
                };
            }

            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (textLayers.indexOf(layer) === -1) {
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

            processPhotoshopScript(doc, layerInfo, pages, initial_pdf_file);
        }

    });
}

function splitTextAndContentLayers(layers, pages) {
    var textLayers = [];
    var contentLayers = [];
    
    // Process each layer
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        
        // Skip hidden or locked layers
        if (!layer.visible || layer.locked) {
            continue;
        }
        
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

function outputStitchedScript(full_script_text, default_file_location) {
    var stitched_script_file = new File(default_file_location + "/stitched_script.jsx");
    if (stitched_script_file.exists) {
        stitched_script_file.remove();
    }

    // Need to specify encoding in case of unicode in script
    stitched_script_file.encoding = "UTF-8";
    usingFile(stitched_script_file, "w", function(file) {
        return file.write(full_script_text);
    });
}
