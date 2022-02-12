
function resizeItemByReplace(item, width_height) {
    item.resize(CoordinateSpaces.INNER_COORDINATES,
        [0,0], 
        ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
        width_height);
}

function resizeItemByFrameDimensions(item, width_height) {
    // Reframe will scale opposing corners by ppi
    item.reframe(
        // CoordinateSpaces.INNER_COORDINATES,
        CoordinateSpaces.PAGE_COORDINATES,
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

function normalizePixels(width_height, fromPpi) {
    return normalizePixelsToPpi(width_height, fromPpi, [72.0, 72.0]);
}

function normalizePixelsToPpi(width_height, fromPpi, toPpi) {
    // 72 desired effective ppi
    // 102 current effective ppi
    // 300 actual ppi
    // 182 dimension - width
    // 128 pixels
    // ppi * pixels = dimen
    // ppi * 128 = 182
    return [
        width_height[0] * (toPpi[0]/fromPpi[0]),
        width_height[1] * (toPpi[1]/fromPpi[1])
    ];
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
            "PNG" === item.imageTypeName) { // TODO: Can this be a check on the needed effectivePpi and geometricBounds?
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
