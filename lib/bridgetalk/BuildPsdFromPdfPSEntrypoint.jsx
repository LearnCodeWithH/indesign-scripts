// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Any external functions will need to be stitched together with this into one large script file.

// Requires stitching "lib/File.jsx" when running through Bridgetalk
// Requires stitching "lib/Datetime.jsx" when running through Bridgetalk
// Requires stitching "lib/Functional.jsx" when running through Bridgetalk
// Requires stitching "lib/bridgetalk/PSConversions.jsx" when running through Bridgetalk
// Requires stitching "lib/bridgetalk/PSPdfImport.jsx" when running through Bridgetalk
// Requires stitching "lib/jam/jamEngine.jsxinc" when running through Bridgetalk
// Requires stitching "lib/jam/jamUtils.jsxinc" when running through Bridgetalk
// Requires stitching "lib/jam/jamHelpers.jsxinc" when running through Bridgetalk
// Requires stitching "lib/jam/jamText.jsxinc" when running through Bridgetalk

#include "../jam/jamEngine.jsxinc"
#include "../jam/jamUtils.jsxinc"
#include "../jam/jamHelpers.jsxinc"
#include "../jam/jamText.jsxinc"

// Utf-8 test: 漢字

function createTextLayersFromData(import_pdf_options, color_profile, page_info_by_page_num, user_export_folder) {
    var open_document_mode = colorModeToOpenDocumentMode(import_pdf_options.color_mode);
    var pdf_open_options = configurePdfOpenOptions(open_document_mode, import_pdf_options.dpi_res, import_pdf_options.anti_alias);
    pdf_open_options.page = 1; // All pdfs only have one page here.

    usingFolder(new Folder(user_export_folder + "/EditablePSDs"), function(folder) {
        for (var pageNum in page_info_by_page_num) {
            var pageInfo = page_info_by_page_num[pageNum];
            var psdDocument = openAndPreparePsdFromPdf(pdf_open_options, pageInfo.firstContentLayer);
            app.activeDocument = psdDocument;

            for (var i = 0; i < pageInfo.layerInfoOrdered.length; i++) {
                var layerInfo = pageInfo.layerInfoOrdered[i];
                if (layerInfo.layerType === "text") {
                    createTextLayerGroupFromInfo(psdDocument, layerInfo);
                } else if (layerInfo.layerType === "content") {
                    createContentLayerFromInfo(psdDocument, pdf_open_options, layerInfo);
                } else {
                    throw new Error("Unknown layer layerType: " + layerInfo.layerType);
                }
            }

            // Save the PSD document
            var pageNumPadded = zeroPad(pageNum, 4);
            var psdFile = new File(folder + "/" + "Page-" + pageNumPadded + ".psd");
            savePSD(psdDocument, psdFile);
        }
    });
}

function savePSD(psdDocument, psdFile) {
    var psSaveOptions = new PhotoshopSaveOptions();
    psSaveOptions.embedColorProfile = true;
    psSaveOptions.layers = true;
    psSaveOptions.alphaChannels = true;
    psdDocument.saveAs(psdFile, psSaveOptions, false);
    psdDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function openAndPreparePsdFromPdf(pdfOpenOptions, contentLayerInfo) {
    var pdfFile = new File(contentLayerInfo.pdfFullFilePath);
    // Open a page of the pdf to photoshop. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won't work
    var workingDoc = app.open(pdfFile, pdfOpenOptions, false);

    // Unlock the layer and clear the layer entirely.
    workingDoc.artLayers[0].allLocked = false;
    workingDoc.artLayers[0].clear();

    return workingDoc;
}

function createContentLayerFromInfo(psdDocument, pdfOpenOptions, contentLayerInfo) {
    var pdfFile = new File(contentLayerInfo.pdfFullFilePath);
    // Open a page of the pdf to photoshop
    var contentDoc = app.open(pdfFile, pdfOpenOptions, false);

    // Unlock the layer for copy
    contentDoc.artLayers[0].allLocked = false;

    // Check if the art layer is empty
    var isLayerEmpty = true;
    try {
        // Try to get the bounds of the layer - if it succeeds and returns valid bounds, the layer is not empty
        var bounds = contentDoc.artLayers[0].bounds;
        if (bounds && bounds.length === 4 && 
            (bounds[2] > bounds[0] && bounds[3] > bounds[1])) {
            isLayerEmpty = false;
        }
    } catch (e) {
        // If an error occurs, assume the layer is empty
        isLayerEmpty = true;
    }

    if (!isLayerEmpty) {
        // Copy the first art layer into a new layer in psdDocument
        contentDoc.artLayers[0].copy();

        // Activate the target document
        app.activeDocument = psdDocument;

        // Paste the copied content
        var newLayer = psdDocument.paste();
        newLayer.name = contentLayerInfo.name;

        // Position the layer if coordinates are provided
        // TODO: Check if positioning is handled by pdf?
        // if (contentLayerInfo.bounds) {
        //     newLayer.translate(contentLayerInfo.bounds.x || 0, contentLayerInfo.bounds.y || 0);
        // }

        // Send to back in layer ordering
        newLayer.move(psdDocument.layers[psdDocument.layers.length - 1], ElementPlacement.PLACEAFTER);
    }
    // Close the content document
    contentDoc.close(SaveOptions.DONOTSAVECHANGES);
    
    return newLayer;
}

function createTextLayerGroupFromInfo(psdDocument, textLayerInfo) {
    var textData = textLayerInfo.textData;
    
    // Make a layer group for the text layers
    var textGroup = psdDocument.layerSets.add();
    textGroup.name = textLayerInfo.name;
    
    // Send the layer group to 1 above back in layer ordering
    textGroup.move(psdDocument.layers[psdDocument.layers.length - 1], ElementPlacement.PLACEAFTER);
    
    // Iterate through the text data and invoke createTextLayerWithStyleRuns for each entry
    for (var i = 0; i < textData.length; i++) {
        createTextLayerWithStyleRuns(psdDocument, textGroup, textData[i]);
    }
    
    return textGroup;
}

function createTextLayerWithStyleRuns(psdDocument, textGroup, textDataEntry) {
    // Create a new text layer in the text group
    var textLayer = psdDocument.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    textLayer.name = buildTextLayerName(textDataEntry);
    
    // Move the text layer into the group
    textLayer.move(textGroup, ElementPlacement.PLACEATEND);
    
    // Handle bounds and positioning
    var bounds = textDataEntry.bounds;
    if (bounds) {
        // Create a bounding box for the text
        var left = bounds.x;
        var top = bounds.y;
        var right = left + bounds.width;
        var bottom = top + bounds.height;
        
        // Create text item with the bounds
        var textItem = textLayer.textItem;
        textItem.kind = TextType.PARAGRAPHTEXT;
        
        // Make sure we set the bounds using the proper rectangle coordinates
        // Note: Photoshop expects [left, top, right, bottom]
        textItem.bounds = [left, top, right, bottom];
    }
    
    // Handle rotation
    if (textDataEntry.frameRotation && textDataEntry.frameRotation !== 0) {
        textLayer.rotate(textDataEntry.frameRotation);
    }
    
    // Handle skew
    if (textDataEntry.skew && textDataEntry.skew !== 0) {
        // NOTE: Photoshop doesn't have direct skew control via scripting
        // May need to create a transform and apply skew through a matrix
    }
    
    // Handle stroke properties
    // NO WORK, NEED SMART FX
    if (textDataEntry.strokeWeight && textDataEntry.strokeWeight > 0) {
        var textItem = textLayer.textItem;
        textItem.strokeColor = parseColor(textDataEntry.strokeColor);
        textItem.strokeWidth = textDataEntry.strokeWeight;
    }
    
    // Handle fill color of the text layer (if specified at layer level)
    // NO WORK, TRANSLATE PALETTE TO HEX BEFORE SENDING TO PHOTOSHOP
    if (textDataEntry.fillColor && textDataEntry.fillColor !== "None") {
        var textItem = textLayer.textItem;
        textItem.color = parseColor(textDataEntry.fillColor);
    }
    
    // Combine all style runs to create the full text
    var fullText = "";
    var styleRuns = textDataEntry.styleRuns || [];
    
    for (var i = 0; i < styleRuns.length; i++) {
        fullText += styleRuns[i].text;
    }
    
    // Set the text content
    textLayer.textItem.contents = fullText;
    
    // TODO: Handle justification and alignment
    // NOTE: Style runs need to handle:
    // font family, font point size, kerning, font color, 
    // letter spacing (tracking), line spacing (leading),
    // horizontal/vertical scale, baseline shift, superscript/subscript,
    // font style (bold, italic), text justification

    // Apply different styles to different parts of the text
    applyStyleRuns(textLayer, styleRuns);
    
    return textLayer;
}

function applyStyleRuns(textLayer, styleRuns) {
    if (!styleRuns || styleRuns.length === 0) return;
    
    // Get the text content from styleRuns
    var fullText = getFullTextFromStyleRuns(styleRuns);
    
    try {
        // Create a structured layer text object using the JAM format
        var layerTextObj = createBaseLayerTextObject(fullText);
        
        // Process each style run and add to textStyleRange
        var position = 0;
        for (var i = 0; i < styleRuns.length; i++) {
            var run = styleRuns[i];
            var from = position;
            var to = position + run.text.length;
            
            // Create text style for this range
            var textStyle = createTextStyleForRun(run);
            
            // Add the style range to our layer text object
            layerTextObj.layerText.textStyleRange.push({
                from: from,
                to: to,
                textStyle: textStyle
            });
            
            // Add paragraph style for alignment
            addParagraphStyleForRun(layerTextObj, run, from, to);
            
            // Update position for next range
            position = to;
        }
        
        // Apply the layer text object to the text layer
        applyLayerTextObjectToLayer(textLayer, layerTextObj);
        
    } catch (e) {
        // Fallback to basic styling method if JAM fails
        alert("Error applying text styles: " + e.message);
    }
}

function getFullTextFromStyleRuns(styleRuns) {
    var fullText = "";
    for (var i = 0; i < styleRuns.length; i++) {
        fullText += sanitizeUnicodeText(styleRuns[i].text);
    }
    return fullText;
}

// Sanitize Unicode text to handle special characters properly
function sanitizeUnicodeText(text) {
    if (!text) return "";
    
    // Replace problematic Unicode characters with their proper equivalents
    // Smart single quotes
    text = text.replace(/[\u2018\u2019]/g, "'");
    // Smart double quotes
    text = text.replace(/[\u201C\u201D]/g, '"');
    // Em dash
    text = text.replace(/\u2014/g, "--");
    // En dash
    text = text.replace(/\u2013/g, "-");
    // Ellipsis
    text = text.replace(/\u2026/g, "...");
    
    return text;
}

function createBaseLayerTextObject(fullText) {
    return {
        layerText: {
            textKey: fullText,
            textShape: [
                {
                    textType: "point",
                    orientation: "horizontal"
                }
            ],
            textStyleRange: [],
            paragraphStyleRange: []
        },
        typeUnit: "pixelsUnit"
    };
}

function createTextStyleForRun(run) {
    var textStyle = {
        // Font properties
        fontPostScriptName: run.fontPostScriptName || run.fontFamily,
        fontName: run.fontFamily,
        size: run.pointSize
    };
    
    applyTracking(textStyle, run);
    applyFontColor(textStyle, run);
    applyLeading(textStyle, run);
    applyScaling(textStyle, run);
    applyBaselineProperties(textStyle, run);
    applyKerningMethod(textStyle, run);
    applyFontStyle(textStyle, run);
    
    return textStyle;
}

function applyTracking(textStyle, run) {
    if (run.tracking !== undefined) {
        textStyle.tracking = run.tracking;
    }
}

function applyFontColor(textStyle, run) {
    if (run.fillColor) {
        if (typeof run.fillColor === "string" && run.fillColor !== "None") {
            // Convert color string to RGB color object
            var color = parseColor(run.fillColor);
            if (color && color.rgb) {
                textStyle.color = { 
                    red: color.rgb.red,
                    green: color.rgb.green,
                    blue: color.rgb.blue
                };
            }
        } else if (run.fillColor.r !== undefined) {
            // Direct RGB values
            textStyle.color = {
                red: run.fillColor.r,
                green: run.fillColor.g,
                blue: run.fillColor.b
            };
        }
    }
}

function applyLeading(textStyle, run) {
    if (run.leading) {
        textStyle.leading = run.leading;
    }
}

function applyScaling(textStyle, run) {
    if (run.horizontalScale) {
        textStyle.horizontalScale = run.horizontalScale;
    }
    
    if (run.verticalScale) {
        textStyle.verticalScale = run.verticalScale;
    }
}

function applyBaselineProperties(textStyle, run) {
    if (run.baselineShift !== undefined) {
        textStyle.baselineShift = run.baselineShift;
    } else if (run.baseline) {
        // Set appropriate baseline property based on baseline type
        if (run.baseline === "superscript") {
            textStyle.baseline = "superScript";
        } else if (run.baseline === "subscript") {
            textStyle.baseline = "subScript";
        }
    }
}

function applyKerningMethod(textStyle, run) {
    if (run.kerningMethod) {
        switch (run.kerningMethod) {
            case "Metrics":
                textStyle.autoKern = "metricsKern";
                break;
            case "Optical":
                textStyle.autoKern = "opticalKern";
                break;
        }
    }
}

function applyFontStyle(textStyle, run) {
    if (run.fontStyle) {
        textStyle.syntheticBold = run.fontStyle.indexOf("Bold") !== -1;
        textStyle.syntheticItalic = run.fontStyle.indexOf("Italic") !== -1;
    }
}

function addParagraphStyleForRun(layerTextObj, run, from, to) {
    if (run.justification) {
        var alignment = getAlignmentForJustification(run.justification);
        
        // Check if we already have a paragraph style for this range
        if (!paragraphStyleExistsForRange(layerTextObj, from, to)) {
            layerTextObj.layerText.paragraphStyleRange.push({
                from: from,
                to: to,
                paragraphStyle: {
                    alignment: alignment
                }
            });
        }
    }
}

function getAlignmentForJustification(justification) {
    switch (justification) {
        case "LEFT_ALIGN":
            return "left";
        case "RIGHT_ALIGN":
            return "right";
        case "CENTER_ALIGN":
            return "center";
        case "JUSTIFIED":
            return "justifyAll";
        default:
            return "left";
    }
}

function paragraphStyleExistsForRange(layerTextObj, from, to) {
    for (var j = 0; j < layerTextObj.layerText.paragraphStyleRange.length; j++) {
        var paraRange = layerTextObj.layerText.paragraphStyleRange[j];
        if (paraRange.from <= from && paraRange.to >= to) {
            return true;
        }
    }
    return false;
}

function applyLayerTextObjectToLayer(textLayer, layerTextObj) {
    // We need to create a reference to our text layer to modify it
    var idTxLr = charIDToTypeID("TxLr");
    var ref = new ActionReference();
    ref.putIdentifier(idTxLr, textLayer.id);
    
    // Use JAM to set the text data to our layer
    var textLayerDesc = jamText.toLayerTextObject(layerTextObj);
    jamEngine.jsonPlay(
        "set",
        {
            "target": ["<reference>", [["layer", ["<identifier>", textLayer.id]]]],
            "to": textLayerDesc
        }
    );
}

function buildTextLayerName(textDataEntry) {
    var textChunks = map(textDataEntry.styleRuns, function(styleRun) {
        return styleRun.text;
    });
    return textChunks.join("");
}

// Helper function to parse color strings
function parseColor(colorString) {
    // Default to black if parsing fails
    var result = {rgb: {red: 0, green: 0, blue: 0}};
    
    if (colorString === "Black") {
        // Already set to black
    } else if (colorString === "White") {
        result.rgb = {red: 255, green: 255, blue: 255};
    } else if (colorString === "Red") {
        result.rgb = {red: 255, green: 0, blue: 0};
    } else if (colorString === "Green") {
        result.rgb = {red: 0, green: 255, blue: 0};
    } else if (colorString === "Blue") {
        result.rgb = {red: 0, green: 0, blue: 255};
    }
    // Add more named colors as needed
    
    return result;
}