//ExportPagesToEditablePsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#target indesign
#include './lib/bridgetalk/BridgeTalk.jsx'
#include './lib/Datetime.jsx'
#include './lib/Functional.jsx';
#include './lib/File.jsx'
#include './lib/Text.jsx'

main();
function main() {
    scriptRunScope(function() {
        requireDocument();
        requirePage(app.activeDocument);

        var doc = app.activeDocument;

        transientDocumentScope(doc, function(doc) {

            // Go through each layer and move all text frames to their own layer.
            // Disable all text frame layers
            // Export each individual non text frame layer to a separate pdf file

            var default_file_location = doc.filePath;

            var pdf_save_file = requireSaveFileViaDialogue("Choose a location to save to Pdf.", "Pdf files:*.pdf", default_file_location);

            // pdf_save_file has the file path
            // /c/Program%20Files/Adobe/Adobe%20InDesign%20CC%202018/Resources/Adobe%20PDF/settings/mul/High%20Quality%20Print.joboptions
            // Sets dialog to first preset.
            export_preset = app.pdfExportPresets[0];
            active_doc.exportFile(ExportFormat.INTERACTIVE_PDF, pdf_save_file, true, export_preset);


            var currentPage = doc.layoutWindows[0].activePage;
            var currentLayer = doc.activeLayer;

            // Get all text frames on current page and layer
            var textFrames = [];
            for (var i = 0; i < currentPage.textFrames.length; i++) {
                var frame = currentPage.textFrames[i];
                if (frame.itemLayer === currentLayer) {
                    textFrames.push(frame);
                }
            }

            var textData = parseTextDataFromTextFrames(textFrames);

            DebugLogger.write("textData => " + textData.length + " items");

            processPhotoshopScript(doc, textData, currentPage);
        }

    });
}

function processPhotoshopScript(doc, textData, currentPage) {
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
    
    // Add function call with data
    var text_data_hash = anonymousHashArraySymbol(textData);
    DebugLogger.writeObject("text_data_hash => ", text_data_hash);
    var args_symbol_array = [
        text_data_hash,
        stringSymbol(currentPage.bounds[3] - currentPage.bounds[1]),
        stringSymbol(currentPage.bounds[2] - currentPage.bounds[0]),
        stringSymbol(72)
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
    if (true) {
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