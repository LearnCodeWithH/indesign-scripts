//ExportFileToPdfInteractiveAndConvertPagesToPsd.jsx
//An InDesign JavaScript

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

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
                    exported_file = active_doc.exportFile(ExportFormat.INTERACTIVE_PDF, save_file, true, export_preset);
                    alert("Wait.");
                });
            alert("All done.");
        });
    });
}

function cloneObjectStyleToAllGraphicsInLayer(clone_style, page, layer) {
    graphics_in_layer = getAllGraphicsInLayer(page.allGraphics, layer)
    each(graphics_in_layer, function(graphic) {
        parent_frame = graphic.parent
        parent_frame.applyObjectStyle(clone_style);
    });
}

