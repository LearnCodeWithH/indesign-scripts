//ExportFileToPdfInteractiveAndConvertPagesToPsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';
#include './lib/bridgetalk/BridgeTalk.jsx';

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
            ensureSaveFileViaDialogue("Choose a location to save to Pdf.", "Pdf files:*.pdf", default_file_location,
                function(save_file) {
                    // Save_file has the file path
                    // /c/Program%20Files/Adobe/Adobe%20InDesign%20CC%202018/Resources/Adobe%20PDF/settings/mul/High%20Quality%20Print.joboptions
                    // TODO: Does this actually impact interactive?
                    export_preset = app.pdfExportPresets[0];
                    active_doc.exportFile(ExportFormat.INTERACTIVE_PDF, save_file, true, export_preset);

                    // TODO: Will assuming RGB 8bit color impact negatively?
                    // TODO: Read dpi settings from a config file in same dir assume 72 dpi?

                    // TODO: Take hint from Edit => Transparency Blend Space for colorspace open?
                    convertPdfToPsdViaPhotoshop(save_file, active_doc);
                    
                });
            alert("All done.");
        });
    });
}

function convertPdfToPsdViaPhotoshop(pdf_file, active_doc) {
     //the doc profiles sent to PS
    var rgbProf = active_doc.rgbProfile;
    var cmykProf = active_doc.cmykProfile;
    
    var bridgetalk = new BridgeTalk();  
    bridgetalk.target = "photoshop";
    
    // Read Photoshop.jsx to string
    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.
    var photoshop_lib_script_path = script_path + "/lib/bridgetalk/Photoshop.jsx"
    var photoshop_script_utf8 = new File(photoshop_lib_script_path).read;
    var photoshop_script_decoded = File.decode(photoshop_script_utf8);
    var ps_script_call = buildFunctionCall("importPdfAsPsd", [pdf_file_path, config_file_path, color_profile]);

    // Fully stitched script into one string.
    bridgetalk.body = photoshop_script_decoded + "\r" + ps_script_call;
    
    bridgetalk.onResult = function(resObj) { 
        //$.writeln("Returned from Photoshop: " + resObj.body)
        bridgetalk = null;
    }  

    bridgetalk.onError = function( from_bridgetalk ) { 
        alert(from_bridgetalk.body); 
    };  
    
    bridgetalk.send(8); 
}

