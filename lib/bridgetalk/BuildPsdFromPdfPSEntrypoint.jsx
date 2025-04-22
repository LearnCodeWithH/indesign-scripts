// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Any external functions will need to be stitched together with this into one large script file.

// Requires stitching "lib/File.jsx" when running through Bridgetalk
// Requires stitching "lib/Datetime.jsx" when running through Bridgetalk
// Requires stitching "lib/Functional.jsx" when running through Bridgetalk
// Requires stitching "lib/bridgetalk/PSConversions.jsx" when running through Bridgetalk
// Requires stitching "lib/bridgetalk/PSPdfImport.jsx" when running through Bridgetalk

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
    applyStyleRuns(textLayer, styleRuns);
    
    return textLayer;
}

function applyStyleRuns(textLayer, styleRuns) {
    if (!styleRuns || styleRuns.length === 0) return;
    
    // Get the text content from styleRuns
    var fullText = "";
    for (var i = 0; i < styleRuns.length; i++) {
        fullText += styleRuns[i].text;
    }
    
    // CharIDs and StringIDs for action descriptors
    var idTxLr = charIDToTypeID("TxLr");
    var idTxt = charIDToTypeID("Txt ");
    var idTxtt = charIDToTypeID("Txtt");
    var idFrom = charIDToTypeID("From");
    var idT = charIDToTypeID("T   ");
    var idnull = charIDToTypeID("null");
    var idsetd = charIDToTypeID("setd");
    var idTextStyle = stringIDToTypeID("textStyle");
    var idBaseline = stringIDToTypeID("baseline");
    var idKrng = charIDToTypeID("Krng");
    
    // Create the main descriptor for text layer modification
    var mainDesc = new ActionDescriptor();
    
    // Set the target text layer
    var layerRef = new ActionReference();
    layerRef.putIdentifier(idTxLr, textLayer.id);
    mainDesc.putReference(idnull, layerRef);
    
    // Create descriptor for text contents and styles
    var textDesc = new ActionDescriptor();
    textDesc.putString(idTxt, fullText);
    
    // Create a list of text style ranges
    var styleRangeList = new ActionList();
    
    // Track position in the text string
    var position = 0;
    
    // Process each style run
    for (var j = 0; j < styleRuns.length; j++) {
        var run = styleRuns[j];
        var from = position;
        var to = position + run.text.length;
        
        // Create descriptor for this text range
        var rangeDesc = new ActionDescriptor();
        rangeDesc.putInteger(idFrom, from);
        rangeDesc.putInteger(idT, to);
        
        // Create style object
        var styleDesc = new ActionDescriptor();
        
        // Apply font family
        if (run.fontFamily) {
            styleDesc.putString(stringIDToTypeID("fontName"), run.fontFamily);
            styleDesc.putString(stringIDToTypeID("fontPostScriptName"), run.fontPostScriptName || run.fontFamily);
        }
        
        // Apply font size
        if (run.pointSize) {
            styleDesc.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), run.pointSize);
        }
        
        // Apply kerning method
        if (run.kerningMethod) {
            var kerningMethod;
            switch(run.kerningMethod) {
                case "Metrics":
                    kerningMethod = stringIDToTypeID("metricsKern");
                    break;
                case "Optical":
                    kerningMethod = stringIDToTypeID("opticalKern");
                    break;
                default:
                    // Default to metrics if not specified or unknown
                    kerningMethod = stringIDToTypeID("metricsKern");
            }
            styleDesc.putEnumerated(stringIDToTypeID("autoKern"), stringIDToTypeID("autoKernType"), kerningMethod);
        }
        
        // Apply font color
        if (run.fillColor) {
            var colorDesc = new ActionDescriptor();
            
            // Determine color type and set values
            if (run.fillColor.r !== undefined) {
                // RGB color
                var rgbDesc = new ActionDescriptor();
                rgbDesc.putDouble(charIDToTypeID('Rd  '), run.fillColor.r);
                rgbDesc.putDouble(charIDToTypeID('Grn '), run.fillColor.g);
                rgbDesc.putDouble(charIDToTypeID('Bl  '), run.fillColor.b);
                colorDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('RGBC'), rgbDesc);
            } else if (typeof run.fillColor === "string") {
                // Color as string - convert to RGB
                var color = parseColor(run.fillColor);
                var rgbDesc = new ActionDescriptor();
                rgbDesc.putDouble(charIDToTypeID('Rd  '), color.rgb.red);
                rgbDesc.putDouble(charIDToTypeID('Grn '), color.rgb.green);
                rgbDesc.putDouble(charIDToTypeID('Bl  '), color.rgb.blue);
                colorDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('RGBC'), rgbDesc);
            }
            
            styleDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('Clr '), colorDesc);
        }
        
        // Apply tracking (letter spacing)
        if (run.tracking) {
            styleDesc.putInteger(charIDToTypeID("Trck"), run.tracking);
        }
        
        // Apply leading (line spacing)
        if (run.leading) {
            styleDesc.putUnitDouble(charIDToTypeID("Ldng"), charIDToTypeID("#Pnt"), run.leading);
        }
        
        // Apply horizontal/vertical scale
        if (run.horizontalScale) {
            styleDesc.putDouble(stringIDToTypeID("horizontalScale"), run.horizontalScale);
        }
        
        if (run.verticalScale) {
            styleDesc.putDouble(stringIDToTypeID("verticalScale"), run.verticalScale);
        }
        
        // Apply baseline shift (superscript/subscript)
        if (run.baselineShift !== undefined && run.baselineShift !== 0) {
            styleDesc.putUnitDouble(stringIDToTypeID("baselineShift"), charIDToTypeID("#Pnt"), run.baselineShift);
        } else if (run.baseline) {
            if (run.baseline === "superscript") {
                styleDesc.putEnumerated(idBaseline, idBaseline, stringIDToTypeID("superScript"));
            } else if (run.baseline === "subscript") {
                styleDesc.putEnumerated(idBaseline, idBaseline, stringIDToTypeID("subScript"));
            } else {
                styleDesc.putEnumerated(idBaseline, idBaseline, stringIDToTypeID("normal"));
            }
        }
        
        // Apply font style (bold, italic)
        if (run.fontStyle) {
            if (run.fontStyle.indexOf("Bold") !== -1) {
                styleDesc.putBoolean(stringIDToTypeID("syntheticBold"), true);
            }
            if (run.fontStyle.indexOf("Italic") !== -1) {
                styleDesc.putBoolean(stringIDToTypeID("syntheticItalic"), true);
            }
        }
        
        // Apply text justification
        // NO WORK
        if (run.justification) {
            var justID;
            switch (run.justification) {
                case "LEFT_ALIGN":
                    justID = stringIDToTypeID("left");
                    break;
                case "RIGHT_ALIGN":
                    justID = stringIDToTypeID("right");
                    break;
                case "CENTER_ALIGN":
                    justID = stringIDToTypeID("center");
                    break;
                case "JUSTIFIED":
                    justID = stringIDToTypeID("justifyAll");
                    break;
            }
            if (justID) {
                styleDesc.putEnumerated(charIDToTypeID("Justf"), stringIDToTypeID("textGridding"), justID);
            }
        }
        
        // Apply the style object to the range
        rangeDesc.putObject(idTextStyle, idTextStyle, styleDesc);
        
        // Add the range to the list
        styleRangeList.putObject(idTxtt, rangeDesc);
        
        // Update position for the next run
        position = to;
    }
    
    // Add the style ranges to the text descriptor
    textDesc.putList(idTxtt, styleRangeList);
    
    // Process specific kerning values between characters if needed
    var kerningList = new ActionList();
    var hasKerningValues = false;
    
    // Create kerning ranges for specific kerning values
    for (var k = 0; k < styleRuns.length; k++) {
        var run = styleRuns[k];
        
        // If run has specific kerning value (not Optical or Metrics)
        if (run.kerning && run.kerning !== "" && 
            run.kerningMethod !== "Optical" && run.kerningMethod !== "Metrics") {
            
            try {
                // Parse the kerning value - could be a string or number
                var kerningValue = parseInt(run.kerning, 10);
                
                if (!isNaN(kerningValue) && kerningValue !== 0) {
                    // Find position in the full text
                    var charPos = 0;
                    for (var m = 0; m < k; m++) {
                        charPos += styleRuns[m].text.length;
                    }
                    
                    // Apply kerning to each character pair in this run
                    for (var p = charPos; p < charPos + run.text.length - 1; p++) {
                        var kernDesc = new ActionDescriptor();
                        kernDesc.putInteger(idFrom, p);
                        kernDesc.putInteger(idT, p + 1);
                        kernDesc.putInteger(idKrng, kerningValue);
                        kerningList.putObject(stringIDToTypeID("kerningRange"), kernDesc);
                        hasKerningValues = true;
                    }
                }
            } catch (e) {
                // Skip if kerning value can't be parsed
            }
        }
    }
    
    // Add kerning ranges to the text descriptor if any exist
    if (hasKerningValues) {
        textDesc.putList(stringIDToTypeID("kerningRange"), kerningList);
    }
    
    // Finalize and execute the action
    mainDesc.putObject(idT, idTxLr, textDesc);
    executeAction(idsetd, mainDesc, DialogModes.NO);
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