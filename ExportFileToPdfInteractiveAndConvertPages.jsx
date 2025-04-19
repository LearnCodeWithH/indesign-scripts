//ExportFileToPdfInteractiveAndConvertPages.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';
#include './lib/bridgetalk/BridgeTalkScript.jsx';

// Config must be fed from ID side script as PS does not have access to read files ID has access to.
#include './config/ImportPdfAndExportPages.config.js';

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
        });
    });
}

function convertPdfToPsdViaPhotoshop(pdf_file, active_doc) {
    var bt_script = createScript(pdf_file, active_doc);

    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAndExportPages.config.js'
    if (included_config["write_debug_bridgetalk_script"] === true) {
        bt_script.outputToFile(active_doc.filePath + "/stitched_script.jsx");
    }

    // Ensure at least one export type is enabled.
    if (included_config["export_psd"] === true || included_config["export_png24"] === true || 
        included_config["export_png8"] === true || included_config["export_jpeg"] === true) {
        bt_script.sendToPhotoshop();
    } else {
        alert("No export types enabled. Please enable at least one export type in 'ImportPdfAndExportPages.config.js'");
    }
}

function createScript(pdf_file, active_doc) {
     //the doc profiles sent to PS
    var rgbProf = active_doc.rgbProfile;
    var color_profile = rgbProf;
    
    // Read Photoshop.jsx to string
    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.

    var bt_script = createBridgeTalkScript();

    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAndExportPages.config.js'
    var pdf_file_path = pdf_file.toString();
    
    return bt_script
        .addFile(script_path + "/lib/Datetime.jsx")
        .addFile(script_path + "/lib/File.jsx")
        .addFile(script_path + "/lib/bridgetalk/PSConversions.jsx")
        .addFile(script_path + "/lib/bridgetalk/PSActions.jsx")
        .addFile(script_path + "/lib/bridgetalk/Photoshop.jsx")
        .addFunctionCall("importPdfAndExportPages", function(symbolBuilder) {
            var import_pdf_options_symbol = {};
            // NOTE: If we wanted to bring back the pdf import config part. Uncomment
            // var import_pdf_options_symbol = symbolBuilder.encodeAnonymousHash(
            //     included_config, 
            //     ["color_mode", "dpi_res", "anti_alias"]);

            var export_types_options_symbol = symbolBuilder.projectObjectByKeys(
                included_config, 
                ["export_psd", "export_png24", "export_png8", 
                "export_jpeg", "png8_color_palette_size"]);

            return [
                pdf_file_path,
                import_pdf_options_symbol,
                color_profile,
                export_types_options_symbol
            ];
        });
}
