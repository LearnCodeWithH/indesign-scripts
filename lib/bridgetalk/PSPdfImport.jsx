// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Any external functions will need to be stitched together with this into one large script file.

// Requires stitching "lib/File.jsx" when running through Bridgetalk

// Utf-8 test: 漢字

function configurePdfOpenOptions(color_mode, dpi_res, anti_alias) {
    // https://www.indesignjs.de/extendscriptAPI/photoshop-latest/index.html#GenericPDFOpenOptions.html
    var openPDFoptions = new PDFOpenOptions;
    openPDFoptions.cropPage = CropToType.TRIMBOX;
    // NOTE: PS seems to autodetect these on pdf open. So we probably don't need to set these.
    if (dpi_res != undefined) openPDFoptions.resolution = dpi_res;
    if (color_mode != undefined) openPDFoptions.mode = color_mode;
    if (anti_alias != undefined) openPDFoptions.antiAlias = anti_alias;
    else openPDFoptions.antiAlias = true;
    return openPDFoptions;
}
