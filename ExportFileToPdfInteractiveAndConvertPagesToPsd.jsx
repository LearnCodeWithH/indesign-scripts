//ExportFileToPdfInteractiveAndConvertPagesToPsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';
#include './lib/bridgetalk/BridgeTalk.jsx';

// Config must be fed from ID side script as PS does not have access to read files ID has access to.
#include './config/ImportPdfAsPsd.config.js';

//This script exports the currently open file to Pdf Interactive 
//then converts the pages of the saved Pdf into Psds.
main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    ensureDocument(function() { 
        ensurePage(function() {
            active_doc = app.activeDocument;
            default_file_location = active_doc.filePath;

            // NOTE: The dialog export prefs override this, so you can't set it.
            // app.pdfExportPreferences.viewPDF = false;
            ensureSaveFileViaDialogue("Choose a location to save to Pdf.", "Pdf files:*.pdf", default_file_location,
                function(save_file) {
                    // Save_file has the file path
                    // /c/Program%20Files/Adobe/Adobe%20InDesign%20CC%202018/Resources/Adobe%20PDF/settings/mul/High%20Quality%20Print.joboptions
                    // Sets dialog to first preset.
                    export_preset = app.pdfExportPresets[0];
                    active_doc.exportFile(ExportFormat.INTERACTIVE_PDF, save_file, true, export_preset);

                    convertPdfToPsdViaPhotoshop(save_file, active_doc);
                });
            alert("All done.");
        });
    });
}

function convertPdfToPsdViaPhotoshop(pdf_file, active_doc) {
    var full_script_text = createScriptText(pdf_file, active_doc);

    outputStitchedScript(full_script_text);

    sendScriptToPhotoshop(full_script_text);
}

function outputStitchedScript(full_script_text) {
    usingFile(new File("stitchedScript.jsx"), "w", function(file) {
        return myFile.write(full_script_text);
    });
}

function createScriptText(pdf_file, active_doc) {
     //the doc profiles sent to PS
    var rgbProf = active_doc.rgbProfile;
    var cmykProf = active_doc.cmykProfile;
    // TODO: Take hint from Edit => Transparency Blend Space for colorspace open?
    // TODO: Will assuming RGB 8bit color impact negatively?
    var color_profile = rgbProf; // TODO: Send both? Or heuristic?
    
    // Read Photoshop.jsx to string
    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.
    var photoshop_lib_script_path = script_path + "/lib/bridgetalk/Photoshop.jsx"
    var photoshop_file_script = readFileForScript(photoshop_lib_script_path);

    var file_lib_script_path = script_path + "/lib/File.jsx"
    var file_file_script = readFileForScript(file_lib_script_path);

    var datetime_lib_script_path = script_path + "/lib/Datetime.jsx"
    var datetime_file_script = readFileForScript(datetime_lib_script_path);
    

    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAsPsd.config.js'
    var pdf_as_psd_config_hash_symbol = anonymousHashSymbol(
            hashEntriesArrayByField(included_config, ["color_mode", "dpi_res", "anti_alias"])
        );

    var pdf_file_path = pdf_file.toString();
    var args_symbol_array = [
        stringSymbol(pdf_file_path), 
        pdf_as_psd_config_hash_symbol, 
        stringSymbol(color_profile)
    ];
    var ps_script_call = buildFunctionCallForScript("importPdfAsPsd", args_symbol_array);

    // Fully stitched script into one string.
    return stitchScripts([
        datetime_file_script, 
        file_file_script, 
        photoshop_file_script, 
        ps_script_call
        ]);
}
