// Functions in this file are meant to be used in Photoshop usually via Bridgetalk.
// Any external functions will need to be stitched together with this into one large script file.

// Requires stitching "lib/File.jsx" when running through Bridgetalk
// Requires stitching "lib/Datetime.jsx" when running through Bridgetalk
// Requires stitching "lib/bridgetalk/PSActions.jsx" when running through Bridgetalk
// Requires stitching "lib/bridgetalk/PSConversions.jsx" when running through Bridgetalk

// Utf-8 test: 漢字

function configurePdfOpenOptions(color_mode, dpi_res, anti_alias) {
    // https://www.indesignjs.de/extendscriptAPI/photoshop-latest/index.html#GenericPDFOpenOptions.html
    // TODO: How many of these are automatic? bit channel depth seems to default to something?
    var openPDFoptions = new PDFOpenOptions;
    openPDFoptions.cropPage = CropToType.TRIMBOX;
    openPDFoptions.resolution = dpi_res;
    openPDFoptions.mode = color_mode;
    openPDFoptions.constrainProportions = true;
    openPDFoptions.antiAlias = anti_alias;
    return openPDFoptions;
}


function importPdf(open_pdf_file, pdf_open_options, color_profile, save_file_folder) {
    var pdfRegex = RegExp("[.]pdf$", "i");
    var pageCount = getPdfPageCount(new File(open_pdf_file.fullName));
    var pageStart = 1;
    var pageEnd = pageCount + 1;
    for (var i = pageStart; i < pageEnd; i++) {
        // Open a page of the pdf to photoshop. Note the 3rd parameter is for smart objects. Needs to be false here or the TRIMBOX won’t work
        pdf_open_options.page = i;
        var working_doc = app.open(open_pdf_file, pdf_open_options, false);
        try {
            working_doc.colorProfileName = color_profile;

            alert("Bit depth: " + working_doc.bitsPerChannel);
            var save_file_path_no_extension = save_file_folder + "/" + open_pdf_file.name.replace(pdfRegex,'') + "_" + zeroPad(i, 4);
            // TODO: Remove extra functions if we use the built in ones
            // var bit_depth = bitPerChannelToInt(open_pdf_file.bitsPerChannel);
            // var color_mode = openDocumentModeToPdfOpenActionColorMode(pdf_open_options.mode);
            // var crop_to = cropToTypeToPdfOpenActionCropTo(pdf_open_options.cropPage);
            // TODO: I dont think we need this with the app.open call. Check other PSActions too.
            // rasterizePDF(i, pdf_open_options.resolution, color_mode, bit_depth, crop_to, open_pdf_file.fullName, null, null);
            savePSD(working_doc, new File(save_file_path_no_extension + ".psd"));
            savePng24(working_doc, new File(save_file_path_no_extension + ".png"), 100);

        } finally {
            working_doc.close(SaveOptions.DONOTSAVECHANGES);
        }
    }

    
};

function getPdfPageCount(the_pdf_file) {
    // Avoid infinite loop, once past 9999 lines, we're probably not in a pdf file.
    var overflow = 0;
    var count = usingFile(the_pdf_file, "r", function(pdf_file) {
        next_line = pdf_file.readln();
        while(overflow < 9999 && next_line.indexOf('/N ') < 0) {
            next_line = pdf_file.readln();
            overflow++;
        }
        
        // First object in a pdf file has the number of pages and is in this format:
        // <</Linearized 1/L 1422340/O 45/E 1371244/N 5/T 1421380/H [ 496 273]>>
        // We are interested in the /N 5/T part

        // Direct /regex/ definitions don't seem to work with bridgetalk in photoshop
        // So define directly in RegExp constructor
        var reg = RegExp("[/]N ([0-9]+)[/]T");
        var matches = next_line.match(reg);
        if (matches === null || matches.length < 2) {
            alert("Could not find page count defined in pdf file.");
            return 0;
        }
        var page_count = matches[1];
        return Number(page_count);
    });

    return count;
};


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
