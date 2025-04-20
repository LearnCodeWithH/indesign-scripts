//SizePageToFirstGraphicInLayer.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';
#include './lib/Validations.jsx';
#include './lib/Graphics.jsx';

//This script fits the page to the original size of the first graphic on the page in the currently selected layer.
scriptRunScope(main);
function main(){
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    requireDocument();
    requirePage(app.activeDocument);
    active_layer = app.activeDocument.activeLayer;
    active_page = app.activeWindow.activePage;
    sizePageToFirstGraphicInLayer(active_page, active_layer);
}

function sizePageToFirstGraphicInLayer(page, layer) {
    var first_graphic = first(page.allGraphics, function(graphic) {
        return graphic.itemLayer === layer;
    })
    if (!first_graphic){
		throw new Error("No graphics found on selected page and layer. Please select a page and layer with a graphic in it and try again.");
	} 
    
    usingViewPreferences(
        {horizontalMeasurementUnits:MeasurementUnits.PIXELS, verticalMeasurementUnits:MeasurementUnits.PIXELS},
        function() {        
            inner_graphic_orig_px_width_height = findPixelDimensionsOfItem(first_graphic);
            if (null !== inner_graphic_orig_px_width_height) {
                rect_frame = first_graphic.parent;
                rect_frame.move([0,0]);
                setItemBounds(rect_frame, [0,0], inner_graphic_orig_px_width_height);
                rect_frame.fit(FitOptions.CONTENT_TO_FRAME);
                resizeToAbsoluteInInnerCoords(page, inner_graphic_orig_px_width_height);
            }
        });
}

