
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
