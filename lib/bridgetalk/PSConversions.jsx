
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

function portableColorToPSColor(portableColor) {
    var solidColor = new SolidColor();
    switch (portableColor.space) {
        case "RGB":
            solidColor.space = portableColor.space;
            solidColor.rgb.red = portableColor.colorValue[0];
            solidColor.rgb.green = portableColor.colorValue[1];
            solidColor.rgb.blue = portableColor.colorValue[2];
            return solidColor;
        case "CMYK":
            solidColor.space = portableColor.space;
            solidColor.cmyk.cyan = portableColor.colorValue[0];
            solidColor.cmyk.magenta = portableColor.colorValue[1];
            solidColor.cmyk.yellow = portableColor.colorValue[2];
            solidColor.cmyk.black = portableColor.colorValue[3];
            return solidColor;
        case "LAB":
            solidColor.space = portableColor.space;
            solidColor.lab.l = portableColor.colorValue[0];
            solidColor.lab.a = portableColor.colorValue[1];
            solidColor.lab.b = portableColor.colorValue[2];
            return solidColor;
        case "HSB":
            solidColor.space = portableColor.space;
            solidColor.hsb.hue = portableColor.colorValue[0];
            solidColor.hsb.saturation = portableColor.colorValue[1];
            solidColor.hsb.brightness = portableColor.colorValue[2];
            return solidColor;
        default:
            return null;
    };
}
