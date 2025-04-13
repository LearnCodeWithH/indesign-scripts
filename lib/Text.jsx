//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

function parseTextDataFromTextFrames(textFrames) {
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

            var fillColorInfo = "";
            if (range.fillColor) {
                if (typeof range.fillColor === "string") {
                    fillColorInfo = range.fillColor;
                } else {
                    fillColorInfo = range.fillColor.name;
                }
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
                fillColor: fillColorInfo,
                horizontalScale: range.horizontalScale,
                verticalScale: range.verticalScale,
                baselineShift: range.baselineShift,
                kerningMethod: range.kerningMethod,
                kerning: kerningValue,
                justification: range.justification.toString()
            });
        }

        var frameFillColor = "None";
        if (frame.fillColor) {
            if (typeof frame.fillColor === "string") {
                frameFillColor = frame.fillColor;
            } else {
                frameFillColor = frame.fillColor.name;
            }
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
            strokeColor: frame.strokeColor.name,
            fillColor: frameFillColor
        });
    }
    return textData;
}

function getTextFramesFromLayer(layer, pages) {
    var textFrames = [];
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        
        // Collect all text frames on this page from the layer
        for (var j = 0; j < page.textFrames.length; j++) {
            var frame = page.textFrames[j];
            if (frame.itemLayer === layer) {
                textFrames.push(frame);
            }
        }
    }
    return textFrames;
}

/**
 * Moves all text frames from the specified layer to a new layer on the given pages
 * @param {Layer} sourceLayer - The layer containing text frames to move
 * @param {Array} pages - Array of pages to process
 * @return {Layer} The newly created text layer
 */
function moveTextToOwnLayer(sourceLayer, pages) {
    if (!sourceLayer || !sourceLayer.isValid) {
        throw new Error("Invalid source layer provided");
    }
    
    if (!pages || !pages.length) {
        throw new Error("No pages provided for processing");
    }
    
    var doc = sourceLayer.parent;
    
    // Create a new layer above the source layer
    var textLayer = doc.layers.add({
        name: sourceLayer.name + " (TextFrames)"
    });
    
    // Position the new layer directly above the source layer
    textLayer.move(LocationOptions.AFTER, sourceLayer);
    
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
        
        // Move each text frame to the new layer
        for (var k = 0; k < frames.length; k++) {
            frames[k].itemLayer = textLayer;
        }
    }
    
    return textLayer;
}
