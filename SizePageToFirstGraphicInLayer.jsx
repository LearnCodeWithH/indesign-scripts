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
            resizeItem(page, width_height);
            reframeToPageCoordPositionByULCorner(page, upper_left_corner, width_height);
        }
    });
}

function findPixelDimensionsOfItem(item) {
    return usingViewPreferences(
        {horizontalMeasurementUnits:MeasurementUnits.INCHES, verticalMeasurementUnits:MeasurementUnits.INCHES},
        function() {
            if ("Photoshop" === item.imageTypeName || 
            "JPEG" === item.imageTypeName ||
            "PNG" === item.imageTypeName) { // TODO: Can this be a check on the needed effectivePpi and geometricBounds?
                return getPixels(item)
            }
            else if (undefined !== item.imageTypeName) {
                alert("Unsupported graphic type '" + item.imageTypeName + "' was the first graphic in layer.");
            }
            else {
                alert("Unsupported graphic type was the first graphic in layer.");
            }
            return null;
        });

}

