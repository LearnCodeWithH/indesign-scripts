//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include "Functional.jsx"

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
                throw new Error("Unsupported graphic type '" + item.imageTypeName + "' was the first graphic in layer.");
            }
            else {
                throw new Error("Unsupported graphic type was the first graphic in layer.");
            }
            return null;
        });
}

function getAllGraphicsInLayer(graphics, layer) {
    return filter(graphics, function(graphic) {
        return graphic.itemLayer === layer;
    })
}

/**
 * Makes only the specified layer visible in the document
 * @param {Document} doc - The InDesign document
 * @param {Layer} targetLayer - The layer to keep visible
 */
function disableAllOtherLayers(doc, targetLayer) {
    if (!doc || !doc.isValid) {
        throw new Error("Invalid document provided");
    }
    
    if (!targetLayer || !targetLayer.isValid) {
        throw new Error("Invalid layer provided");
    }
    
    // Go through all layers in the document
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        
        // Skip the target layer
        if (layer === targetLayer) {
            layer.visible = true;
            continue;
        }
        
        // Hide all other layers
        layer.visible = false;
    }
}

function setLosslessPdfPreset(preset) {
    preset.colorBitmapCompression = BitmapCompression.NONE;
    preset.colorBitmapSampling = Sampling.NONE;
    preset.grayscaleBitmapCompression = BitmapCompression.NONE;
    preset.grayscaleBitmapSampling = Sampling.NONE;
    preset.monochromeBitmapCompression = BitmapCompression.NONE;
    preset.monochromeBitmapSampling = Sampling.NONE;   
}

/**
 * Converts InDesign colors to a portable RGB format that Photoshop can use
 * @param {Document} doc - InDesign document containing the color
 * @param {Color|String} color - InDesign color object or color name
 * @returns {Object} RGB color object in format {r: 0-255, g: 0-255, b: 0-255} or null if color is "None"
 */
function convertInDesignColorToPortable(doc, color, targetColorSpace) {
    if (!color || color === "None") {
        return null;
    }

    // The ink values that create the color, specified as a percentage for each ink. 
    // Note: The number of values required and the range depends on the color space. 
    // For RGB, specify three values, with each value in the range 0 to 255; 
    // for CMYK, specify four values representing C, M, Y, and K, with each value in the range 0 to 100; 
    // for LAB, specify three values representing L (Range: 0 to 100), A (Range: -128 to 127), and B (Range: -128 to 127); 
    // for mixed ink, specify values for each ink in the ink list, with each value in the range 0 to 100.

    var typedColor = color;
    if (typeof typedColor === "string") {
        typedColor = doc.colors.itemByName(color);
        if (!typedColor) {
            typedColor = doc.tints.itemByName(color);
        }
    }
    
    if (typeof typedColor === "object" && typedColor.constructor.name === "Color") {

        if (!isSupportedPortableColorSpace(typedColor.space)) {
            return null;
        }

        var colorValue = typedColor.colorValue;
        var colorSpace = typedColor.space;
        if (targetColorSpace && targetColorSpace !== colorSpace) {
            colorValue = doc.colorTransform(colorValue, colorSpace, targetColorSpace);
            if (targetColorSpace === ColorSpace.RGB) {
                colorValue = normalizeRGBColor(colorValue);
            }
            colorSpace = targetColorSpace;
            DebugLogger.write("Converted " + convertInDesignColorSpaceToString(typedColor.space) + " color to " + convertInDesignColorSpaceToString(targetColorSpace) + " color space. " + 
                typedColor.colorValue + " to " + colorValue);
        }

        return {
            space: convertInDesignColorSpaceToString(colorSpace),
            colorValue: colorValue,
        }
    }
    
    // We don't support MixedInks, Tints, or Gradients, so treat as no color.
    return null;
}

function normalizeRGBColor(colorValue) {
    // Normalize RGB values to be in the range 0-255
    return map(colorValue, function(value) {
        return Math.round(value * 255);
    });
}

function convertInDesignColorSpaceToString(idColorSpace) {
    switch (idColorSpace) {
        case ColorSpace.RGB:
            return "RGB";
        case ColorSpace.CMYK:
            return "CMYK";
        case ColorSpace.LAB:
            return "LAB";
        default:
            return undefined;
    }
}

function isSupportedPortableColorSpace(colorSpace) {
    return any([ColorSpace.RGB, ColorSpace.CMYK, ColorSpace.LAB], function(supportedColorSpace) {
        return colorSpace === supportedColorSpace;
    });
}

