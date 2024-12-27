
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

function savePng24(doc, saveFile, Quality) {
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG;
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = Quality;
    doc.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); 
};

function savePng8(doc, saveFile, Quality, colorPaletteSize) {
    if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG;
    pngOpts.PNG8 = true; 
    if (colorPaletteSize != undefined && colorPaletteSize !== "auto") pngOpts.colors = colorPaletteSize; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = Quality;
    doc.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); 
};
