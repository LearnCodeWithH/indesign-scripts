// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Any external functions will need to be stitched together with this into one large script file.

// Requires stitching "lib/File.jsx" when running through Bridgetalk
// Requires stitching "lib/Datetime.jsx" when running through Bridgetalk

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
                if (layerInfo.type === "text") {
                    createTextLayerGroupFromInfo(psdDocument, layerInfo);
                } else if (layerInfo.type === "content") {
                    createContentLayerFromInfo(psdDocument, pdf_open_options, layerInfo);
                } else {
                    throw new Error("Unknown layer type: " + layerInfo.type);
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
    workingDoc.backgroundLayer.allLocked = false;
    workingDoc.backgroundLayer.clear();

    return workingDoc;
}

function createContentLayerFromInfo(psdDocument, pdfOpenOptions, contentLayerInfo) {
    var pdfFile = new File(contentLayerInfo.pdfFullFilePath);
    // Open a page of the pdf to photoshop
    var contentDoc = app.open(pdfFile, pdfOpenOptions, false);

    // Unlock the layer for copy
    contentDoc.backgroundLayer.allLocked = false;

    // Copy the background layer into a new layer in psdDocument
    contentDoc.backgroundLayer.copy();
    
    // Activate the target document
    app.activeDocument = psdDocument;
    
    // Paste the copied content
    var newLayer = psdDocument.paste();
    newLayer.name = contentLayerInfo.name;
    
    // Position the layer if coordinates are provided
    // if (contentLayerInfo.bounds) {
    //     newLayer.translate(contentLayerInfo.bounds.x || 0, contentLayerInfo.bounds.y || 0);
    // }
    
    // Send to back in layer ordering
    newLayer.move(psdDocument.layers[psdDocument.layers.length - 1], ElementPlacement.PLACEAFTER);
    
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
    textGroup.add(textLayer);
    
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
        textItem.position = [left, top];
        textItem.width = bounds.width;
        textItem.height = bounds.height;
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
    var textItem = textLayer.textItem;
    textItem.contents = fullText;
    
    // Apply different styles to different parts of the text
    // Unfortunately, Photoshop's ExtendScript doesn't support styling individual runs within a text layer
    // We'll apply the style of the first run as the base style for the entire layer
    // NO WORK, NEED TO SEE HOW PS HANDLES MULTIPLE STYLES
    if (styleRuns.length > 0) {
        var firstRun = styleRuns[0];
        
        // Set font properties
        if (firstRun.fontFamily) {
            textItem.font = firstRun.fontFamily;
        }
        
        // Set font style (bold, italic, etc.)
        if (firstRun.fontStyle) {
            // Photoshop doesn't directly set font style via strings
            // You would need to select the proper font variant
        }
        
        // Set point size
        if (firstRun.pointSize) {
            textItem.size = firstRun.pointSize;
        }
        
        // Set leading (line spacing)
        if (firstRun.leading) {
            textItem.leading = firstRun.leading;
        }
        
        // Set tracking (letter spacing)
        if (firstRun.tracking) {
            textItem.tracking = firstRun.tracking;
        }
        
        // Set text color
        if (firstRun.fillColor) {
            textItem.color = parseColor(firstRun.fillColor);
        }
        
        // Set horizontal/vertical scale
        if (firstRun.horizontalScale) {
            textItem.horizontalScale = firstRun.horizontalScale;
        }
        
        if (firstRun.verticalScale) {
            textItem.verticalScale = firstRun.verticalScale;
        }
        
        // Set justification (alignment)
        if (firstRun.justification) {
            switch (firstRun.justification) {
                case "LEFT_ALIGN":
                    textItem.justification = Justification.LEFT;
                    break;
                case "RIGHT_ALIGN":
                    textItem.justification = Justification.RIGHT;
                    break;
                case "CENTER_ALIGN":
                    textItem.justification = Justification.CENTER;
                    break;
                case "JUSTIFIED":
                    textItem.justification = Justification.JUSTIFIED;
                    break;
            }
        }
    }
    
    return textLayer;
}

function buildTextLayerName(textDataEntry) {
    var textChunks = map(textDataEntry.styleRuns, function(styleRun) {
        return styleRun.text;
    });
    return textChunks.join("");
}

// Helper function to parse color strings
function parseColor(colorString) {
    if (!colorString || colorString === "None") {
        return new SolidColor();
    }
    
    var color = new SolidColor();
    
    // Handle named colors
    switch (colorString) {
        case "Black":
            color.rgb.red = 0;
            color.rgb.green = 0;
            color.rgb.blue = 0;
            break;
        case "White":
            color.rgb.red = 255;
            color.rgb.green = 255;
            color.rgb.blue = 255;
            break;
        case "Red":
            color.rgb.red = 255;
            color.rgb.green = 0;
            color.rgb.blue = 0;
            break;
        case "Green":
            color.rgb.red = 0;
            color.rgb.green = 255;
            color.rgb.blue = 0;
            break;
        case "Blue":
            color.rgb.red = 0;
            color.rgb.green = 0;
            color.rgb.blue = 255;
            break;
        // Add more named colors as needed
        
        default:
            // If colorString is in format "R,G,B" or other formats, parse it here
            // For now, default to black
            color.rgb.red = 0;
            color.rgb.green = 0;
            color.rgb.blue = 0;
    }
    
    return color;
}