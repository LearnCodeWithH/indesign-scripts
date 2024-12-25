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
    // https://www.indesignjs.de/extendscriptAPI/photoshop-latest/index.html#GenericPDFOpenOptions.html
    var openPDFoptions = new PDFOpenOptions;
    openPDFoptions.cropPage = CropToType.TRIMBOX;
    openPDFoptions.resolution = dpi_res;
    openPDFoptions.mode = color_mode;
    openPDFoptions.constrainProportions = true;
    openPDFoptions.antiAlias = anti_alias;
    return openPDFoptions;
}

// TODO: Factor out conversions to own file
function colorModeToOpenDocumentMode(color_mode) {
    // https://www.indesignjs.de/extendscriptAPI/photoshop-latest/index.html#OpenDocumentMode.html
    switch (color_mode) {
        case "RGB":
            return OpenDocumentMode.RGB;
        case "CMYK":
            return OpenDocumentMode.CMYK;
        case "LAB":
            return OpenDocumentMode.LAB;
        case "GRAYSCALE":
            return OpenDocumentMode.GRAYSCALE;
        default:
            return OpenDocumentMode.RGB;
    }
}

function bitPerChannelToInt(bit_per_channel) {
    switch (bit_per_channel) {
        case BitsPerChannelType.ONE:
            return 1;
        case BitsPerChannelType.EIGHT:
            return 8;
        case BitsPerChannelType.SIXTEEN:
            return 16;
        case BitsPerChannelType.THIRTYTWO:
            return 32;
        default:
            return 8;
    }
}

function importPdf(open_pdf_file, pdf_open_options, color_profile, save_file_folder) {
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

    var active_doc = app.activeDocument;

    active_doc.colorProfileName = color_profile;

    var pageCount = getPdfPageCount(new File(open_pdf_file.fullName));
    alert ("Page Count: " + pageCount);
    var pageStart = 1;
    var pageEnd = pageCount + 1;
    for (var i = pageStart; i < pageEnd; i++) {
        var save_file_path_no_extension = save_file_folder + "/" + open_pdf_file.name.replace(/\.pdf$/,'') + "_" + zeroPad(i, 4);
        var bitDepth = bitPerChannelToInt(open_pdf_file.bitsPerChannel);
        rasterizePDF(i, open_pdf_file.resolution, open_pdf_file.mode, bitDepth, "boundingBox", open_pdf_file.fullName);
        savePSD(new File(save_file_path_no_extension + ".psd"));
        savePng24(new File(save_file_path_no_extension + ".png"), 100);

        // placePdfLayerViaAction(open_pdf_file.fullName, pdf_open_options.antiAlias);

        // active_doc.layers[0].name = "Pdf Import";
        // active_doc.rasterizeAllLayers();
    }

    active_doc.close(SaveOptions.DONOTSAVECHANGES);
    
}

function getPdfPageCount(the_pdf_file) {
    // Avoid infinite loop, once past 9999 lines, we're probably not in a pdf file.
    var overflow = 0;
    return usingFile(the_pdf_file, "r", function(pdf_file) {
        next_line = pdf_file.readln();
        while (overflow < 9999 && next_line.indexOf('/N ') < 0) {
            next_line = pdf_file.readln();
            overflow++;
        }
            
        // First object in a pdf file has the number of pages and is in this format:
        // <</Linearized 1/L 1422340/O 45/E 1371244/N 5/T 1421380/H [ 496 273]>>
        // We are interested in the /N 5/T part
        var page_count = next_line.match(/\/N (\d+)\/T/)[1];
        return Number(page_count);
    });
}

function charToType(s) { return app.charIDToTypeID(s); }
function strToType(s) { return app.stringIDToTypeID(s); }

function placePdfLayerViaAction(pdf_file_path, anti_alias) {
    var place_action = new ActionDescriptor();
    var crop_action = new ActionDescriptor();	
    crop_action.putEnumerated( charToType('Crop'), strToType('cropTo'), strToType('cropBox') ); 
    place_action.putObject( charToType('As  '), charToType('PDFG'), crop_action );
    place_action.putPath( charToType('null'), new File(pdf_file_path));
    place_action.putEnumerated( charToType('FTcs'), charToType('QCSt'), charToType('Qcsa') );
    place_action.putBoolean( charToType('AntA'), anti_alias);
    executeAction( charToType('Plc '), place_action, DialogModes.NO );
}

// TODO: Factor out actions based functions to own file
// rasterizePDF( a,res,mode,bitDepth,cropto,pdfFile,W,H);
// https://www.indesignjs.de/extendscriptAPI/photoshop-latest/index.html#CropToType.html
function rasterizePDF( pageNumber,res,mode,bitDepth,cropto,pdfFile,Width,Height) {
    var desc = new ActionDescriptor(); 

    var optionsDesc = new ActionDescriptor(); 
    optionsDesc.putString( charToType( 'Nm  ' ), 'rasterized page' ); 
    optionsDesc.putEnumerated( charToType( 'Crop' ), strToType( 'cropTo' ), strToType( cropto ) ); 
    optionsDesc.putUnitDouble( charToType( 'Rslt' ), charToType( '#Rsl' ), res); 
    optionsDesc.putEnumerated( charToType( 'Md  ' ), charToType( 'ClrS' ), charToType( mode ) );
    optionsDesc.putInteger( charToType( 'Dpth' ), bitDepth ); 
    optionsDesc.putBoolean( charToType( 'AntA' ), true ); 
    if (Width != undefined) optionsDesc.putUnitDouble( charToType('Wdth'), charToType('#Pxl'), Width );
    if (Height != undefined) optionsDesc.putUnitDouble( charToType('Hght'), charToType('#Pxl'), Height );
    optionsDesc.putBoolean( strToType( 'suppressWarnings' ), false ); 
    optionsDesc.putEnumerated( charToType( 'fsel' ), strToType( 'pdfSelection' ), strToType( 'page'  )); 
    optionsDesc.putInteger( charToType( 'PgNm' ), pageNumber ); 

    desc.putObject( charToType( 'As  ' ), charToType( 'PDFG' ), optionsDesc ); 
    desc.putPath( charToType( 'null' ), File(pdfFile) ); 

    executeAction( charToType( 'Opn ' ), desc, DialogModes.NO ); 
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
//         function charToType(s) { return app.charIDToTypeID(s); };
//         function strToType(s) { return app.stringIDToTypeID(s); };
//         var placeAction = new ActionDescriptor();
//         var cropAction = new ActionDescriptor();	
//         cropAction.putEnumerated( charToType('Crop'), strToType('cropTo'), strToType('cropBox') ); 
//         placeAction.putObject( charToType('As  '), charToType('PDFG'), cropAction );
//         placeAction.putPath( charToType('null'), new File(thePath));
//         placeAction.putEnumerated( charToType('FTcs'), charToType('QCSt'), charToType('Qcsa') );
//         placeAction.putBoolean( charToType('AntA'), isAA);//anti alias true
//         executeAction( charToType('Plc '), placeAction, DialogModes.NO );
        
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

    var open_document_mode = colorModeToOpenDocumentMode(import_pdf_options.color_mode);
    var pdf_open_options = configurePdfOpenOptions(open_document_mode, import_pdf_options.dpi_res, import_pdf_options.anti_alias);

    usingFile(new File(pdf_file_path), "r", function(pdf_file) {
        var parent_dir = pdf_file.parent; // Doesnt have trailing backslash.
        var save_file_folder_name = parent_dir + "/" + pdf_file.name + "_" + datetimeString(new Date());
        var save_file_folder = new Folder(save_file_folder_name);
        if (!save_file_folder.create()) {
            alert("Could not create folder: " + save_file_folder);
            return;
        } else {
            importPdf(pdf_file, pdf_open_options, color_profile, save_file_folder);
            return;
        }
    });
    
}

function savePSD(saveFile){ 
    psdSaveOptions = new PhotoshopSaveOptions(); 
    psdSaveOptions.embedColorProfile = true; 
    psdSaveOptions.alphaChannels = true;  
    psdSaveOptions.layers = true; 
    app.activeDocument.saveAs(saveFile, psdSaveOptions, false, Extension.LOWERCASE); 
};

function saveJpeg(saveFile,Quality){
    var doc = activeDocument;
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;  
    jpgSaveOptions = new JPEGSaveOptions()
    jpgSaveOptions.embedColorProfile = true
    jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
    jpgSaveOptions.matte = MatteType.NONE
    jpgSaveOptions.quality = Quality; 
    activeDocument.saveAs(saveFile, jpgSaveOptions, true,Extension.LOWERCASE)
};
function saveForWeb(saveFile,Quality) {
    var doc = activeDocument;
    var tmpName = File(File(saveFile).path + "/SFW_TEMP.jpg");
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    var sfwOptions = new ExportOptionsSaveForWeb(); 
    sfwOptions.format = SaveDocumentType.JPEG; 
    sfwOptions.includeProfile = false; 
    sfwOptions.interlaced = 0; 
    sfwOptions.optimized = true; 
    sfwOptions.quality = Quality; 
    activeDocument.exportDocument(tmpName, ExportType.SAVEFORWEB, sfwOptions);
    tmpName.rename(decodeURI(File(saveFile).name));
};
function savePng24(saveFile,Quality){
    var doc = activeDocument;
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG;
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = Quality;
    activeDocument.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); 
};