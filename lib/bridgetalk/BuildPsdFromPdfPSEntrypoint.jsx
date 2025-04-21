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
            var psdDocument = openAndPreparePsdFromPdf(pageInfo.pdfFilePath, pdf_open_options, pageInfo.firstContentLayer);

            for (var i = 0; i < pageInfo.layerInfoOrdered.length; i++) {
                var layerInfo = pageInfo.layerInfoOrdered[i];
                if (layerInfo.type === "text") {
                    createTextLayerGroupFromInfo(psdDocument, pdf_open_options, layerInfo);
                } else if (layerInfo.type === "content") {
                    createContentLayerFromInfo(psdDocument, layerInfo);
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
    // Open a page of the pdf to photoshop. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won’t work
    var workingDoc = app.open(pdfFile, pdfOpenOptions, false);

    // Unlock the layer and clear the layer entirely.
    workingDoc.backgroundLayer.allLocked = false;
    workingDoc.backgroundLayer.clear();

    return workingDoc;
}

function createContentLayerFromInfo(psdDocument, pdfOpenOptions, contentLayerInfo) {
    var pdfFile = new File(contentLayerInfo.pdfFullFilePath);
    // Open a page of the pdf to photoshop. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won’t work
    var contentDoc = app.open(pdfFile, pdfOpenOptions, false);

    // Unlock the layer for copy
    contentDoc.backgroundLayer.allLocked = false;

    // Copy the background layer into a new layer in psdDocument and send to 1 above back in layer ordering.
}

function createTextLayerGroupFromInfo(psdDocument, textLayerInfo) {
    var textData = textLayerInfo.textData;

    // Make a layer group for the text layers
    // Send the layer group to 1 above back in layer ordering.
    // Iterate through the text data and invoke createTextLayerWithStyleRuns for each entry.
}

function createTextLayerWithStyleRuns(psdDocument, textGroup, textDataEntry) {
    // Create a new text layer in the text group
    // Use the values of the textDataEntry to position, rotate, set style runs, etc for the text layer.
}