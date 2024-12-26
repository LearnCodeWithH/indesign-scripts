
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
            return undefined;
    }
}

// Open action has different color mode strings than the enum type
// Mappings pulled from this script: https://github.com/Paul-Riggott/PS-Scripts/blob/master/PDF%20ProcessorII.jsx
function openDocumentModeToPdfOpenActionColorMode(open_document_mode) {
    switch (open_document_mode) {
        case OpenDocumentMode.RGB:
            return "RGBC";
        case OpenDocumentMode.CMYK:
            return "ECMY";
        case OpenDocumentMode.LAB:
            return "LbCl";
        case OpenDocumentMode.GRAYSCALE:
            return "Grys";
        default:
            return "RGBC";
    }
}

// Open action has different cropt to strings than the enum type
// Mappings pulled from this script: https://github.com/Paul-Riggott/PS-Scripts/blob/master/PDF%20ProcessorII.jsx
function cropToTypeToPdfOpenActionCropTo(crop_to_type) {
    switch (crop_to_type) {
        case CropToType.BOUNDINGBOX:
            return "boundingBox";
        case CropToType.MEDIABOX:
            return "mediaBox";
        case CropToType.CROPBOX:
            return "cropBox";
        case CropToType.BLEEDBOX:
            return "bleedBox";
        case CropToType.TRIMBOX:
            return "trimBox";
        case CropToType.ARTBOX:
            return "artBox";
        default:
            return "boundingBox";
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