
function resizeItem(item, width_height) {
    item.resize(CoordinateSpaces.INNER_COORDINATES,
        [0,0], 
        ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
        width_height);
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

    var r = image.effectivePpi;
    var w = image.geometricBounds[3] - image.geometricBounds[1]; // x2-x1
    var h = image.geometricBounds[2] - image.geometricBounds[0]; // y2-y1
    var hpd = Math.round(w * (r[0]));
    var vpd = Math.round(h * (r[1]));

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
