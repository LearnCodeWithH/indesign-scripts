//CloneStyleFromSelectedItemForAllGraphicsInLayer.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

//This script changes the object style for all graphics found on the currently selected layer 
// to the object style of the currently selected item.
scriptRunScope(main);
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    requireDocument();
    requirePage(app.activeDocument);
    requireSelectedPageItem(app.activeDocument);
    var active_layer = app.activeDocument.activeLayer;
    var pages = app.activeDocument.pages;
    var selected_item = app.activeDocument.selectedPageItems[0];
    each(pages, function(page) {
        cloneObjectStyleToAllGraphicsInLayer(selected_item.appliedObjectStyle, page, active_layer);
    });
}

function cloneObjectStyleToAllGraphicsInLayer(clone_style, page, layer) {
    var graphics_in_layer = getAllGraphicsInLayer(page.allGraphics, layer)
    each(graphics_in_layer, function(graphic) {
        parent_frame = graphic.parent
        parent_frame.applyObjectStyle(clone_style);
    });
}

