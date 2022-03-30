// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Do not rely on external functions where possible as you will need to stitch everything together.

function configurePdfOpenOptions(color_mode, dpi_res, anti_alias) {
    var openPDFoptions = new PDFOpenOptions;
    openPDFoptions.cropPage = CropToType.TRIMBOX;
    openPDFoptions.resolution = dpi_res;
    openPDFoptions.mode = color_mode;
    openPDFoptions.constrainProportions = true;
    openPDFoptions.antiAlias = anti_alias;
    return openPDFoptions;
}

function importPdf(pdf_file_path, pdf_open_options, color_profile) {
    // Open the PDF. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won’t work
    app.open(new File(pdf_file_path), pdf_open_options, false);

    var active_doc = app.activeDocument;

    active_doc.colorProfileName = color_profile;

    placePdfLayerViaAction(pdf_file_path, pdf_open_options.antiAlias);

    active_doc.layers[0].name = "Pdf Import";
    active_doc.rasterizeAllLayers();
    
}

function cTID(s) { return app.charIDToTypeID(s); }
function sTID(s) { return app.stringIDToTypeID(s); }

function placePdfLayerViaAction(pdf_file_path, anti_alias) {
    var place_action = new ActionDescriptor();
    var crop_action = new ActionDescriptor();	
    crop_action.putEnumerated( cTID('Crop'), sTID('cropTo'), sTID('cropBox') ); 
    place_action.putObject( cTID('As  '), cTID('PDFG'), crop_action );
    place_action.putPath( cTID('null'), new File(pdf_file_path));
    place_action.putEnumerated( cTID('FTcs'), cTID('QCSt'), cTID('Qcsa') );
    place_action.putBoolean( cTID('AntA'), anti_alias);
    executeAction( cTID('Plc '), place_action, DialogModes.NO );
}

// function psScript(firstLayer, thePath, colorMode, layerName, theRes, isAA, isSmart) { 
//         //get the color mode constant
//         if (colorMode == "RGB") {
//             cMode = OpenDocumentMode.RGB;
//         }else if (colorMode == "CMYK") {
//             cMode = OpenDocumentMode.CMYK;
//         }else {
//             cMode = OpenDocumentMode.LAB;
//         }

//         //the PDF Open Options
//         var openPDFoptions = new PDFOpenOptions;
//         openPDFoptions.cropPage = CropToType.TRIMBOX;
//         openPDFoptions.resolution = theRes;
//         openPDFoptions.mode = cMode;
//         openPDFoptions.constrainProportions = true;
//         openPDFoptions.antiAlias = isAA;
//         //open the PDF. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won’t work
//         app.open(new File(thePath), openPDFoptions, false);
        
//         //assign the InDesign profiles
//         if (colorMode == "RGB") {
//             app.activeDocument.colorProfileName = rgbProf;
//         }
//         if (colorMode == "CMYK") {
//             app.activeDocument.colorProfileName = cmykProf;
//         }

//         //place the PDF layer
//         function cTID(s) { return app.charIDToTypeID(s); };
//         function sTID(s) { return app.stringIDToTypeID(s); };
//         var placeAction = new ActionDescriptor();
//         var cropAction = new ActionDescriptor();	
//         cropAction.putEnumerated( cTID('Crop'), sTID('cropTo'), sTID('cropBox') ); 
//         placeAction.putObject( cTID('As  '), cTID('PDFG'), cropAction );
//         placeAction.putPath( cTID('null'), new File(thePath));
//         placeAction.putEnumerated( cTID('FTcs'), cTID('QCSt'), cTID('Qcsa') );
//         placeAction.putBoolean( cTID('AntA'), isAA);//anti alias true
//         executeAction( cTID('Plc '), placeAction, DialogModes.NO );
        
//         //name the layer—layers[0] is the top layer
//         app.activeDocument.layers[0].name = layerName;
        
//         //removes the opened layer leaving the placed layer
//         if (firstLayer) {
//            app.activeDocument.layers[1].remove();           
//         } 
    
//         //rasterize the layers if isSmart is false
//         if (!isSmart) {
//             app.activeDocument.rasterizeAllLayers();
//         } 
//         return 
//     }  

function parseImportPdfConfig(file_content) {
    // TODO: Parse file content

    var config = new Object();
    config.color_mode = OpenDocumentMode.RGB;
    config.dpi_res = 72;
    config.anti_alias = true;
    return config;
}

// Based on script from https://github.com/antipalindrome/Photoshop-Export-Layers-to-Files-Fast
function importPdfAsPsd(pdf_file_path, config_file_path, color_profile) {
    // Read config file for preset config.
    config_file_content = "";// new File(config_file_path).readString;
    config = parseImportPdfConfig(config_file_content);

    // Extract pdf open options from config
    pdf_open_options = configurePdfOpenOptions(config.color_mode, config.dpi_res, config.anti_alias);

    // slap config file values into open options
    // For each page
    // get page number
    importPdf(pdf_file_path, pdf_open_options, color_profile);
    // save psd as pg num
}
