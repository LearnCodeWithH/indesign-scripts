

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

// https://www.indesignjs.de/extendscriptAPI/photoshop-latest/index.html#CropToType.html
function rasterizePDF( pageNumber, res, mode, bitDepth, cropto, pdfFile, width, height) {
    var desc = new ActionDescriptor(); 

    var optionsDesc = new ActionDescriptor(); 
    optionsDesc.putString( charToType( 'Nm  ' ), 'rasterized page' ); 
    optionsDesc.putEnumerated( charToType( 'Crop' ), strToType( 'cropTo' ), strToType( cropto ) ); 
    optionsDesc.putUnitDouble( charToType( 'Rslt' ), charToType( '#Rsl' ), res); 
    optionsDesc.putEnumerated( charToType( 'Md  ' ), charToType( 'ClrS' ), charToType( mode ) );
    optionsDesc.putInteger( charToType( 'Dpth' ), bitDepth ); 
    optionsDesc.putBoolean( charToType( 'AntA' ), true ); 
    if (width != undefined && width !== null) optionsDesc.putUnitDouble( charToType('Wdth'), charToType('#Pxl'), width );
    if (height != undefined && height !== null) optionsDesc.putUnitDouble( charToType('Hght'), charToType('#Pxl'), height );
    optionsDesc.putBoolean( strToType( 'suppressWarnings' ), false ); 
    optionsDesc.putEnumerated( charToType( 'fsel' ), strToType( 'pdfSelection' ), strToType( 'page'  )); 
    optionsDesc.putInteger( charToType( 'PgNm' ), pageNumber ); 

    desc.putObject( charToType( 'As  ' ), charToType( 'PDFG' ), optionsDesc ); 
    desc.putPath( charToType( 'null' ), File(pdfFile) ); 

    executeAction( charToType( 'Opn ' ), desc, DialogModes.NO ); 
}; 


function savePSD(doc, saveFile){ 
    psdSaveOptions = new PhotoshopSaveOptions(); 
    psdSaveOptions.embedColorProfile = true; 
    psdSaveOptions.alphaChannels = true;  
    psdSaveOptions.layers = true; 
    doc.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE); 
};

function saveJpeg(doc, saveFile,Quality) {
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;  
    jpgSaveOptions = new JPEGSaveOptions()
    jpgSaveOptions.embedColorProfile = true
    jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
    jpgSaveOptions.matte = MatteType.NONE
    jpgSaveOptions.quality = Quality; 
    doc.saveAs(saveFile, jpgSaveOptions, true,Extension.LOWERCASE)
};

function saveForWeb(doc, saveFile,Quality) {
    var tmpName = File(File(saveFile).path + "/SFW_TEMP.jpg");
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    var sfwOptions = new ExportOptionsSaveForWeb(); 
    sfwOptions.format = SaveDocumentType.JPEG; 
    sfwOptions.includeProfile = false; 
    sfwOptions.interlaced = 0; 
    sfwOptions.optimized = true; 
    sfwOptions.quality = Quality; 
    doc.exportDocument(tmpName, ExportType.SAVEFORWEB, sfwOptions);
    tmpName.rename(decodeURI(File(saveFile).name));
};

function savePng24(doc, saveFile,Quality) {
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG;
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = Quality;
    doc.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); 
};