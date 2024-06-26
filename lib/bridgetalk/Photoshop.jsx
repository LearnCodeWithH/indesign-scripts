// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Do not rely on external functions where possible as you will need to stitch everything together.

// Requires stitching "lib/File.jsx" when running through Bridgetalk
// Requires stitching "lib/Datetime.jsx" when running through Bridgetalk
// #include '../File.jsx'; // Local file testing only.
// #include '../Datetime.jsx'; // Local file testing only.

// Utf-8 test: 漢字

// main();
// function main() {
//     // Direct Photoshop Call Test
//     importPdfAsPsd("/e/Projects/Scripts/ID/indesign-scripts/Ignored/Test/Blah.pdf",{ color_mode: "OpenDocumentMode.RGB", dpi_res: 72, anti_alias: true },"sRGB IEC61966-2.1");
// }

function configurePdfOpenOptions(color_mode, dpi_res, anti_alias) {
    var openPDFoptions = new PDFOpenOptions;
    openPDFoptions.cropPage = CropToType.TRIMBOX;
    openPDFoptions.resolution = dpi_res;
    openPDFoptions.mode = color_mode;
    openPDFoptions.constrainProportions = true;
    openPDFoptions.antiAlias = anti_alias;
    return openPDFoptions;
}

function importPdf(open_pdf_file, pdf_open_options, color_profile, psds_folder) {
    // Open the PDF. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won’t work
    app.open(open_pdf_file, pdf_open_options, false);
    // for(var i = 1; i < app.documents.length; i++) {
    //         // save under folder, filename.pdf psds
    //         // For each page
    //         // get page number
            
    //         // save psd as pg num
    //         psdsaveFile = File(saveFile + ".psd");
    //         if(psdsaveFile.exists){
    //         psdsaveFile = File(psdsaveFile.toString().replace(/\.psd$/,'') + "_" + time() + ".psd");
    //         }
    //         SavePSD(psdsaveFile);
    // }

    // var active_doc = app.activeDocument;

    // active_doc.colorProfileName = color_profile;

    // placePdfLayerViaAction(pdf_file_path, pdf_open_options.antiAlias);

    // active_doc.layers[0].name = "Pdf Import";
    // active_doc.rasterizeAllLayers();
    
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

function rasterizePDF( pageNumber,res,mode,BitDepth,cropto,pdfFile,Width,Height){
    var desc = new ActionDescriptor(); 

    var optionsDesc = new ActionDescriptor(); 
    optionsDesc.putString( charIDToTypeID( 'Nm  ' ), 'rasterized page' ); 
    optionsDesc.putEnumerated( charIDToTypeID( 'Crop' ), stringIDToTypeID( 'cropTo' ), stringIDToTypeID( cropto ) ); 
    optionsDesc.putUnitDouble( charIDToTypeID( 'Rslt' ), charIDToTypeID( '#Rsl' ), res); 
    optionsDesc.putEnumerated( charIDToTypeID( 'Md  ' ), charIDToTypeID( 'ClrS' ), charIDToTypeID( mode ) );
    optionsDesc.putInteger( charIDToTypeID( 'Dpth' ), BitDepth ); 
    optionsDesc.putBoolean( charIDToTypeID( 'AntA' ), true ); 
    if(Width != undefined) optionsDesc.putUnitDouble( charIDToTypeID('Wdth'), charIDToTypeID('#Pxl'), Width );
    if(Height != undefined)optionsDesc.putUnitDouble( charIDToTypeID('Hght'), charIDToTypeID('#Pxl'), Height );
    optionsDesc.putBoolean( stringIDToTypeID( 'suppressWarnings' ), false ); 
    optionsDesc.putEnumerated( charIDToTypeID( 'fsel' ), stringIDToTypeID( 'pdfSelection' ), stringIDToTypeID( 'page'  )); 
    optionsDesc.putInteger( charIDToTypeID( 'PgNm' ), pageNumber ); 

    desc.putObject( charIDToTypeID( 'As  ' ), charIDToTypeID( 'PDFG' ), optionsDesc ); 
    desc.putPath( charIDToTypeID( 'null' ), File(pdfFile) ); 

    executeAction( charIDToTypeID( 'Opn ' ), desc, DialogModes.NO ); 
}; 

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

// Based on script from https://github.com/antipalindrome/Photoshop-Export-Layers-to-Files-Fast
function importPdfAsPsd(pdf_file_path, import_pdf_options, color_profile) {
    // Extract pdf open options from the import config
    pdf_open_options = configurePdfOpenOptions(import_pdf_options.color_mode, import_pdf_options.dpi_res, import_pdf_options.anti_alias);

    usingFile(new File(pdf_file_path), "r", function(pdf_file) {
        var parent_dir = pdf_file.parent; // Doesnt have trailing backslash.
        var psds_folder_name = parent_dir + "/" + pdf_file.name + "_" + datetimeString(new Date());
        var psds_folder = new Folder(psds_folder_name);
        if (!psds_folder.create()) {
            alert("Could not create folder: " + psds_folder);
            return;
        } else {
            importPdf(pdf_file, pdf_open_options, color_profile, psds_folder);
            return;
        }
    });
    
}

function SavePSD(saveFile){ 
    psdSaveOptions = new PhotoshopSaveOptions(); 
    psdSaveOptions.embedColorProfile = true; 
    psdSaveOptions.alphaChannels = true;  
    psdSaveOptions.layers = true; 
    app.activeDocument.saveAs(saveFile, psdSaveOptions, false, Extension.LOWERCASE); 
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
};