// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Any external functions will need to be stitched together with this into one large script file.

// Requires stitching "lib/Datetime.jsx" when running through Bridgetalk

// Utf-8 test: 漢字

function createTextLayersFromData(textData, docWidth, docHeight, docDpi) {
    var doc = app.documents.add(
        docWidth,
        docHeight,
        docDpi, 
        "InDesign Text Frames " + datetimeString(new Date())
    );
    
    // Now textData is directly the array of frames
    for (var i = 0; i < textData.length; i++) {
        var frameData = textData[i];
        var textLayer = doc.artLayers.add();
        textLayer.kind = LayerKind.TEXT;
        
        // Position the text layer
        var textItem = textLayer.textItem;
        textItem.position = [frameData.bounds.x, frameData.bounds.y];
        
        // Handle multiple style runs
        var combinedText = "";
        for (var j = 0; j < frameData.styleRuns.length; j++) {
            var run = frameData.styleRuns[j];
            combinedText += run.text;
        }
        
        // Set initial text content
        textItem.contents = combinedText;
        
        // Apply text frame properties
        if (frameData.frameRotation) {
            textLayer.rotate(frameData.frameRotation);
        }
        
        // Set frame dimensions
        textItem.width = frameData.bounds.width;
        textItem.height = frameData.bounds.height;
        
        // Name the layer
        textLayer.name = "Text Frame " + (i + 1);
        
        // Apply style runs
        try {
            var runs = frameData.styleRuns;
            if (runs.length > 0) {
                // Apply first run's properties to whole layer as base
                var baseRun = runs[0];
                textItem.font = baseRun.fontFamily;
                textItem.size = baseRun.pointSize;
                textItem.tracking = baseRun.tracking;
                
                // If we have multiple runs, we need to apply character styles
                if (runs.length > 1) {
                    var charStyles = textItem.characterStyles;
                    var runStart = 0;
                    
                    for (var k = 0; k < runs.length; k++) {
                        var run = runs[k];
                        var runLength = run.text.length;
                        
                        if (runLength > 0) {
                            var charStyle = charStyles.add();
                            charStyle.range = [runStart, runStart + runLength];
                            
                            try {
                                charStyle.font = run.fontFamily;
                                charStyle.size = run.pointSize;
                                charStyle.tracking = run.tracking;
                            } catch(e) {}
                            
                            runStart += runLength;
                        }
                    }
                }
            }
        } catch(e) {
            // Handle any errors in text styling
        }
    }
}