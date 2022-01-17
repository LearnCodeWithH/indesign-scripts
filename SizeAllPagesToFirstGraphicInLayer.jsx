//SizePageToFirstGraphicInLayer.jsx
//An InDesign JavaScript

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

//This script fits the page to the first object found on the currently selected layer.
main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    ensureDocument(function() { 
        ensurePage(function() {
            active_layer = app.activeDocument.activeLayer;
            active_page = app.activeWindow.activePage;
            sizePageToFirstGraphicInLayer(active_page, active_layer);
            alert("All good");
        });
    });
}

function sizePageToFirstGraphicInLayer(page, layer) {
    return ensureFirstGraphicInLayer(page.allGraphics, layer, 
    function(first_graphic) {
        width_height = findPixelDimensionsOfItem(first_graphic);
        // Returns Array[Array{x,y}[Real]], needs to be unwrapped
        upper_left_corner = first_graphic.resolve(AnchorPoint.TOP_LEFT_ANCHOR, CoordinateSpaces.PAGE_COORDINATES)[0];

        if (null !== width_height) {
            resizeItemByReplace(page, width_height);
            reframeToPageCoordPositionByULCorner(page, upper_left_corner, width_height);
            resizeItemByFrameDimensions(first_graphic, width_height);
        }
    });
}

