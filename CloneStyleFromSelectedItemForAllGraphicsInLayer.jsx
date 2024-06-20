//CloneStyleFromSelectedItemForAllGraphicsInLayer.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

//This script changes the object style for all graphics found on the currently selected layer 
// to the object style of the currently selected item.
main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    ensureDocument(function() { 
        ensurePage(function() {
            active_layer = app.activeDocument.activeLayer;
            pages = app.activeDocument.pages;
            selected_items = app.activeDocument.selectedPageItems
            ensureFirstSelectedItem(selected_items, function(selected_item) {
                each(pages, function(page) {
                    cloneObjectStyleToAllGraphicsInLayer(selected_item.appliedObjectStyle, page, active_layer);
                });
            });
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

