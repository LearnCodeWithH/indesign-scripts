//SizePageToFirstGraphicInLayer.jsx
//An InDesign JavaScript

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

//This script fits the page to the original size of the first graphic on the page in the currently selected layer.
main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    ensureDocument(function() { 
        ensurePage(function() {
            active_layer = app.activeDocument.activeLayer;
            active_page = app.activeWindow.activePage;
            sizePageToFirstGraphicInLayer(active_page, active_layer);
        });
    });
}

function sizePageToFirstGraphicInLayer(page, layer) {
    return ensureFirstGraphicInLayer(page.allGraphics, layer, 
    function(first_graphic) {
        inner_graphic_orig_px_width_height = findPixelDimensionsOfItem(first_graphic);

        if (null !== inner_graphic_orig_px_width_height) {
            usingViewPreferences(
                {horizontalMeasurementUnits:MeasurementUnits.PIXELS, verticalMeasurementUnits:MeasurementUnits.PIXELS},
                function() {        
                    rect_frame = first_graphic.parent;
                    first_graphic.move([0,0]);
                    reframeAndFitInPageCoords(first_graphic, [0,0], inner_graphic_orig_px_width_height);
                    resizeToAbsoluteInPageCoords(page, inner_graphic_orig_px_width_height);
                })
        }
    });
}

