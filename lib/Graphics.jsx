
function resizeItemByReplace(item, width_height) {
    item.resize(CoordinateSpaces.INNER_COORDINATES,
        [0,0], 
        ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
        width_height);
}

function resizeItemByFrameDimensions(item, width_height) {
    item.reframe(
        CoordinateSpaces.INNER_COORDINATES,
        [[0,0],width_height]
    );
    item.fit(FitOptions.FRAME_TO_CONTENT);
}

function reframeToPageCoordPositionByULCorner(item, ul_corner_pos, width_height) {
     item.reframe(CoordinateSpaces.PAGE_COORDINATES,
            [ul_corner_pos, 
            [ul_corner_pos[0]+width_height[0], ul_corner_pos[1]+width_height[1]]])
}

// Sourced from https://community.adobe.com/t5/indesign-discussions/having-trouble-extracting-the-pixel-dimensions-of-an-image-link-in-indesign/m-p/10952544#M177184
/**
* returns the pixel dimensions of an image
* @param image  
*/
function getPixels(image){

    var rx = image.effectivePpi[0];
    var ry = image.effectivePpi[1];
    var w = image.geometricBounds[3] - image.geometricBounds[1]; // x2-x1
    var h = image.geometricBounds[2] - image.geometricBounds[0]; // y2-y1
    var hpd = Math.round(w * rx);
    var vpd = Math.round(h * ry);

    return [hpd, vpd];
}

function usingViewPreferences(preferenceProperties, func) {
    var previousPrefs = app.activeDocument.viewPreferences.properties
    try {
        app.activeDocument.viewPreferences.properties = preferenceProperties;
        return func();
    } finally {
        app.activeDocument.viewPreferences.properties = previousPrefs;
    }
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
