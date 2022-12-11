//SizePageToFirstGraphicInLayer.jsx
//An InDesign JavaScript

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

//This script fits every page to the original size of the first graphic on the page in the currently selected layer.
main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    ensureDocument(function() { 
        ensurePage(function() {
            active_layer = app.activeDocument.activeLayer;
            pages = app.activeDocument.pages;
            each(pages, function(page) {
                sizePageToFirstGraphicInLayer(page, active_layer);
            });
        });
    });
}

// NOTE: For dpi may need to move/resize the parent rectangle instead of the graphic
function sizePageToFirstGraphicInLayer(page, layer) {
    return ensureFirstGraphicInLayer(page.allGraphics, layer, 
    function(first_graphic) {
        return usingViewPreferences(
            {horizontalMeasurementUnits:MeasurementUnits.PIXELS, verticalMeasurementUnits:MeasurementUnits.PIXELS},
            function() {        
                inner_graphic_orig_px_width_height = findPixelDimensionsOfItem(first_graphic);
                if (null !== inner_graphic_orig_px_width_height) {
                    rect_frame = first_graphic.parent;
                    rect_frame.move([0,0]);
                    setItemBounds(rect_frame, [0,0], inner_graphic_orig_px_width_height);
                    rect_frame.fit(FitOptions.CONTENT_TO_FRAME);
                    resizeToAbsoluteInPageCoords(page, inner_graphic_orig_px_width_height);
                }
            });
    });
}

