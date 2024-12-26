//ExportFileToPdfInteractiveAndConvertPages.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';
#include './lib/bridgetalk/BridgeTalk.jsx';

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
    var full_script_text = createScriptText(pdf_file, active_doc);

    
    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAndExportPages.config.js'
    if (included_config["write_debug_bridgetalk_script"] === true) {
        outputStitchedScript(full_script_text, active_doc.filePath);
    }

    // Ensure at least one export type is enabled.
    if (included_config["export_psd"] === true || included_config["export_png"] === true || included_config["export_jpeg"] === true) {
        sendScriptToPhotoshop(full_script_text);
    } else {
        alert("No export types enabled. Please enable at least one export type in 'ImportPdfAndExportPages.config.js'");
    }
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

function createScriptText(pdf_file, active_doc) {
     //the doc profiles sent to PS
    var rgbProf = active_doc.rgbProfile;
    var color_profile = rgbProf;
    
    // Read Photoshop.jsx to string
    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.
    var photoshop_lib_script_path = script_path + "/lib/bridgetalk/Photoshop.jsx"
    var photoshop_file_script = readFileForScript(photoshop_lib_script_path);

    var file_lib_script_path = script_path + "/lib/File.jsx"
    var file_file_script = readFileForScript(file_lib_script_path);

    var datetime_lib_script_path = script_path + "/lib/Datetime.jsx"
    var datetime_file_script = readFileForScript(datetime_lib_script_path);
    
    var psconversion_lib_script_path = script_path + "/lib/bridgetalk/PSConversions.jsx"
    var psconversion_file_script = readFileForScript(psconversion_lib_script_path);
    
    var psaction_lib_script_path = script_path + "/lib/bridgetalk/PSActions.jsx"
    var psaction_file_script = readFileForScript(psaction_lib_script_path);

    var included_config = import_pdf_as_psd_config; // From 'ImportPdfAndExportPages.config.js'
    // NOTE: If we wanted to bring back the pdf import config part. Uncomment
    // var import_pdf_options_symbol = anonymousHashSymbol(
    //         hashEntriesArrayByField(included_config, ["color_mode", "dpi_res", "anti_alias"])
    //     );

    var import_pdf_options_symbol = anonymousHashSymbol([]);

    var export_types_options_symbol = anonymousHashSymbol(
            hashEntriesArrayByField(included_config, ["export_psd", "export_png", "export_jpeg"])
        );

    var pdf_file_path = pdf_file.toString();
    var args_symbol_array = [
        stringSymbol(pdf_file_path), 
        import_pdf_options_symbol, 
        stringSymbol(color_profile),
        export_types_options_symbol
    ];
    var ps_script_call = buildFunctionCallForScript("importPdfAndExportPages", args_symbol_array);

    // Fully stitched script into one string.
    return stitchScripts([
        datetime_file_script, 
        file_file_script, 
        psconversion_file_script, 
        psaction_file_script, 
        photoshop_file_script, 
        ps_script_call
        ]);
}
