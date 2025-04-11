//ExportPagesToEditablePsd.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#target indesign
#include './lib/bridgetalk/BridgeTalk.jsx'
#include './lib/Datetime.jsx'
#include './lib/Functional.jsx';
#include './lib/File.jsx'

main();
function main() {
    if (!app.documents.length) {
        alert("No documents open.");
        return;
    }

    var doc = app.activeDocument;
    var currentPage = doc.layoutWindows[0].activePage;
    var currentLayer = doc.activeLayer;

    // Get all text frames on current page and layer
    var textFrames = [];
    for (var i = 0; i < currentPage.textFrames.length; i++) {
        var frame = currentPage.textFrames[i];
        if (frame.itemLayer === currentLayer) {
            textFrames.push(frame);
        }
    }

    if (!textFrames.length) {
        alert("No text frames found on current page and layer.");
        return;
    }

    // Collect text frame data with detailed formatting
    var textData = [];
    for (var i = 0; i < textFrames.length; i++) {
        var frame = textFrames[i];
        var bounds = frame.geometricBounds; // [y1, x1, y2, x2]
        
        // Collect style runs for each text frame
        var styleRuns = [];
        var story = frame.parentStory;
        
        for (var j = 0; j < story.textStyleRanges.length; j++) {
            var range = story.textStyleRanges[j];

            var fontInfo = "";
            if (range.appliedFont) {
                fontInfo = (typeof range.appliedFont === "string") ? 
                    range.appliedFont : 
                    range.appliedFont.fontFamily;
            }

            var fillColorInfo = "";
            if (range.fillColor) {
                fillColorInfo = (typeof range.fillColor === "string") ? 
                    range.fillColor : 
                    range.fillColor.name;
            }

            var kerningValue = "";
            if (range.kerningMethod === "None") {
                // KerningValue can't be accessed for Optical or Metrics
                kerningValue = range.kerningValue;
            }
            
            styleRuns.push({
                text: range.contents,
                fontFamily: fontInfo,
                fontStyle: range.fontStyle,
                pointSize: range.pointSize,
                leading: range.leading,
                tracking: range.tracking,
                fillColor: fillColorInfo,
                horizontalScale: range.horizontalScale,
                verticalScale: range.verticalScale,
                baselineShift: range.baselineShift,
                kerningMethod: range.kerningMethod,
                kerning: kerningValue,
                justification: range.justification.toString()
            });
        }

        var frameFillColor = "None";
        if (frame.fillColor) {
            frameFillColor = (typeof frame.fillColor === "string") ? 
                frame.fillColor : 
                frame.fillColor.name;
        }

        // TODO: Check what is populated in here, then ensure encoding works.
        textData.push({
            bounds: {
                x: bounds[1],
                y: bounds[0],
                width: bounds[3] - bounds[1],
                height: bounds[2] - bounds[0]
            },
            styleRuns: styleRuns,
            frameRotation: frame.rotationAngle,
            skew: frame.shearAngle,
            strokeWeight: frame.strokeWeight,
            strokeColor: frame.strokeColor.name,
            fillColor: frameFillColor
        });
    }

    var script_path = (new File($.fileName)).parent; // Doesnt have trailing backslash.
    var photoshop_lib_script_path = script_path + "/lib/bridgetalk/PhotoshopText.jsx"
    var photoshop_file_script = readFileForScript(photoshop_lib_script_path);

    var file_lib_script_path = script_path + "/lib/File.jsx"
    var file_file_script = readFileForScript(file_lib_script_path);

    var datetime_lib_script_path = script_path + "/lib/Datetime.jsx"
    var datetime_file_script = readFileForScript(datetime_lib_script_path);
    
    // Add function call with data
    var text_data_hash = anonymousHashArraySymbol(textData);
    var args_symbol_array = [
        text_data_hash,
        stringSymbol(currentPage.bounds[3] - currentPage.bounds[1]),
        stringSymbol(currentPage.bounds[2] - currentPage.bounds[0]),
        stringSymbol(72)
    ];
    var ps_script_call = buildFunctionCallForScript("createTextLayersFromData", args_symbol_array);

    // Send to Photoshop
    var full_script_text = stitchScripts([
        datetime_file_script, 
        file_file_script, 
        photoshop_file_script, 
        ps_script_call
        ]);

    if (true) {
        outputStitchedScript(full_script_text, doc.filePath);
    }

    // sendScriptToPhotoshop(full_script_text);

}

function outputStitchedScript(full_script_text, default_file_location) {
    var stitched_script_file = new File(default_file_location + "/stitched_script.jsx");
    if (stitched_script_file.exists) {
        stitched_script_file.remove();
    }

    // Need to specify encoding in case of unicode in script
    stitched_script_file.encoding = "UTF-8";
    usingFile(stitched_script_file, "w", function(file) {
        return file.write(full_script_text);
    });
}