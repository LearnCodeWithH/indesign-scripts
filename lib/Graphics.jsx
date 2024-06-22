
/**
* Resizes item to absolute width and height specified in page coordinates. Units are determined by View Preferences. Use 'usingViewPreferences' to change.
*/
function resizeToAbsoluteInInnerCoords(item, width_height) {
    item.resize(
        CoordinateSpaces.INNER_COORDINATES,
        AnchorPoint.TOP_LEFT_ANCHOR,
        ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
        width_height
    );
}

/**
* Sets geometric bounds. Units are determined by View Preferences. Use 'usingViewPreferences' to change.
*/
function setItemBounds(item, ul_corner_pos, width_height) {
    // [y1, x1, y2, x2] UL and BR corners of box.
    item.geometricBounds = [ul_corner_pos[1], 
        ul_corner_pos[0], 
        ul_corner_pos[1]+width_height[1], 
        ul_corner_pos[0]+width_height[0]];
}

// Sourced from https://community.adobe.com/t5/indesign-discussions/having-trouble-extracting-the-pixel-dimensions-of-an-image-link-in-indesign/m-p/10952544#M177184
/**
* returns the pixel dimensions of an image
* @param image  
*/
function getPixels(image){
    return getPixelsAtPpi(image, image.effectivePpi);
}

// Sourced from https://community.adobe.com/t5/indesign-discussions/having-trouble-extracting-the-pixel-dimensions-of-an-image-link-in-indesign/m-p/10952544#M177184
/**
* returns the pixel dimensions of an image at a specified ppi
* @param image  
* @param atPpi  
*/
function getPixelsAtPpi(image, atPpi) {
    var rx = atPpi[0];
    var ry = atPpi[1];
    var w = image.geometricBounds[3] - image.geometricBounds[1]; // x2-x1
    var h = image.geometricBounds[2] - image.geometricBounds[0]; // y2-y1
    var hpd = Math.round(w * rx);
    var vpd = Math.round(h * ry);

    return [hpd, vpd];
}

function getPageDimensions(page) {
    var w = page.bounds[3] - page.bounds[1]; // x2-x1
    var h = page.bounds[2] - page.bounds[0]; // y2-y1

    return [w, h];
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
    return findPixelDimensionsOfItemAtPpi(item, item.effectivePpi)
}

function findPixelDimensionsOfItemAtPpi(item, atPpi) {
    return usingViewPreferences(
        {horizontalMeasurementUnits:MeasurementUnits.INCHES, verticalMeasurementUnits:MeasurementUnits.INCHES},
        function() {
            if ("Photoshop" === item.imageTypeName || 
            "JPEG" === item.imageTypeName ||
            "PNG" === item.imageTypeName) {
                return getPixelsAtPpi(item, atPpi)
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

function getAllGraphicsInLayer(graphics, layer) {
    return filter(graphics, function(graphic) {
        return graphic.itemLayer === layer;
    })
}
