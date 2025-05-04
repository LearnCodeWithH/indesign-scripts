
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

function colorSpaceStringToPSColorModel(colorSpace) {
    switch (colorSpace) {
        case "RGB":
            return ColorModel.RGB;
        case "CMYK":
            return ColorModel.CMYK;
        case "LAB":
            return ColorModel.LAB;
        case "GRAYSCALE":
            return ColorModel.GRAYSCALE;
        default:
            return undefined;
    }
}

function portableColorToPSColor(portableColor) {
    var color = null;
    switch (portableColor.space) {
        case "RGB":
            color = new RGBColor();
            color.red = portableColor.colorValue[0];
            color.green = portableColor.colorValue[1];
            color.blue = portableColor.colorValue[2];
            return color;
        case "CMYK":
            color = new CMYKColor();
            color.cyan = portableColor.colorValue[0];
            color.magenta = portableColor.colorValue[1];
            color.yellow = portableColor.colorValue[2];
            color.black = portableColor.colorValue[3];
            return color;
        case "LAB":
            color = new LabColor();
            color.L = portableColor.colorValue[0];
            color.A = portableColor.colorValue[1];
            color.B = portableColor.colorValue[2];
            return color;
        default:
            return null;
    };
}
