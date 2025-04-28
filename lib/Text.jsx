//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

// Make sure we include the Graphics library for color conversion
#include "Graphics.jsx"

function parseTextDataFromTextFrames(doc, textFrames) {
    if (!textFrames || textFrames.length === 0) {
        return []; // No text frames to process
    }
    
    // Collect text frame data with detailed formatting
    var textData = [];
    for (var i = 0; i < textFrames.length; i++) {
        var frame = textFrames[i];
        var bounds = frame.geometricBounds; // [y1, x1, y2, x2]
        
        // Collect style runs for each text frame
        var styleRuns = [];
        var story = frame.parentStory;
        
        for (var j = 0; j < story.textStyleRanges.length; j++) {
            var range = story.textStyleRanges[j];

            var fontInfo = "";
            if (range.appliedFont) {
                if (typeof range.appliedFont === "string") {
                    fontInfo = range.appliedFont;
                } else {
                    fontInfo = range.appliedFont.fontFamily;
                }
            }

            // Convert fill color to portable format
            var portableColor = null;
            if (range.fillColor) {
                portableColor = convertInDesignColorToPortable(doc, range.fillColor);
            }

            var kerningValue = "";
            if (range.kerningMethod === "None") {
                // KerningValue can't be accessed for Optical or Metrics
                kerningValue = range.kerningValue;
            }
            
            styleRuns.push({
                text: range.contents,
                fontFamily: fontInfo,
                fontStyle: range.fontStyle,
                pointSize: range.pointSize,
                leading: range.leading,
                tracking: range.tracking,
                fillColor: portableColor,
                horizontalScale: range.horizontalScale,
                verticalScale: range.verticalScale,
                baselineShift: range.baselineShift,
                kerningMethod: range.kerningMethod,
                kerning: kerningValue,
                justification: range.justification.toString()
            });
        }

        // Convert frame fill color to portable format
        var framePortableColor = null;
        if (frame.fillColor) {
            framePortableColor = convertInDesignColorToPortable(doc, frame.fillColor);
        }
        
        // Convert frame stroke color to portable format
        var frameStrokePortableColor = null;
        if (frame.strokeColor) {
            frameStrokePortableColor = convertInDesignColorToPortable(doc, frame.strokeColor);
        }

        textData.push({
            bounds: {
                x: bounds[1],
                y: bounds[0],
                width: bounds[3] - bounds[1],
                height: bounds[2] - bounds[0]
            },
            styleRuns: styleRuns,
            frameRotation: frame.rotationAngle,
            skew: frame.shearAngle,
            strokeWeight: frame.strokeWeight,
            strokeColor: frameStrokePortableColor,
            fillColor: framePortableColor,
        });
    }
    return textData;
}

function getTextFramesFromLayerByPages(layer, pages) {
    var textFramesByPage = {};
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        var textFrames = [];
        
        // Collect all text frames on this page from the layer
        for (var j = 0; j < page.textFrames.length; j++) {
            var frame = page.textFrames[j];
            if (frame.itemLayer === layer) {
                textFrames.push(frame);
            }
        }

        textFramesByPage[page.name] = textFrames;
    }
    return textFramesByPage;
}

/**
 * Moves all text frames from the specified layer to a new layer on the given pages
 * @param {Layer} sourceLayer - The layer containing text frames to move
 * @param {Array} pages - Array of pages to process
 * @return {Layer} The newly created text layer
 */
function moveTextToOwnLayer(doc, sourceLayer, pages) {
    if (!sourceLayer || !sourceLayer.isValid) {
        throw new Error("Invalid source layer provided");
    }
    
    if (!pages || !pages.length) {
        throw new Error("No pages provided for processing");
    }

    var framesByPageNum = {};
    var hasAnyFrames = false;
    // Process each page
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        
        // Collect all text frames on this page from the source layer
        var frames = [];
        for (var j = 0; j < page.textFrames.length; j++) {
            var frame = page.textFrames[j];
            if (frame.itemLayer === sourceLayer) {
                frames.push(frame);
            }
        }

        hasAnyFrames = hasAnyFrames || frames.length > 0;
        framesByPageNum[page.name] = frames;
    }

    var textLayer = null;
    if (hasAnyFrames) {
        // Create a new layer above the source layer
        textLayer = doc.layers.add();
        textLayer.name = sourceLayer.name + " (TextFrames)";
        
        // Position the new layer directly above the source layer
        textLayer.move(LocationOptions.BEFORE, sourceLayer);

        for (var pageNum in framesByPageNum) {
            var frames = framesByPageNum[pageNum];
            
            // Move each text frame to the new layer
            for (var k = 0; k < frames.length; k++) {
                frames[k].itemLayer = textLayer;
            }
        }
    }
    
    return textLayer;
}
