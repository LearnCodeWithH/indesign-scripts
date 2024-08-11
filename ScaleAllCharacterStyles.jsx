//ScaleAllCharacterStyles.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './lib/Functional.jsx';

function scaleStyle(style, scale_factor) {
    with (style) {
        if (leading !== undefined && leading !== Leading.AUTO) {
            leading = leading * scale_factor;
        }
        if (appliedFont) {
            pointSize = pointSize * scale_factor;
        }
        if (spaceBefore !== undefined) {
            spaceBefore = spaceBefore * scale_factor;
        }
        if (spaceAfter !== undefined) {
            spaceAfter = spaceAfter * scale_factor;
        }
        if (firstLineIndent !== undefined) {
            firstLineIndent = firstLineIndent * scale_factor;
        }
        if (leftIndent !== undefined) {
            leftIndent = leftIndent * scale_factor;
        }
        if (rightIndent !== undefined) {
            rightIndent = rightIndent * scale_factor;
        }
    }

    return style;
}

function promptScalePercentFromUser() {
    // Prompt user for scale percentage
    var scale_pct = prompt("Enter the scale percentage 0-500. (e.g., 120 for 120%, 100 for no change):", "100");

    scale_pct = parseFloat(scale_pct);
    
    if (scale_pct !== null && !isNaN(scale_pct) && scale_pct > 0 && scale_pct <= 500) {
        return scale_pct
    }
    
    alert("Invalid input. Enter a number between 0-500.");
    return NaN;
}

var scale_pct = promptScalePercentFromUser();

if (!isNaN(scale_pct)) {
    var doc = app.activeDocument;
    var paragraphStyles = doc.allParagraphStyles;

    var scale_factor = scale_pct / 100.0;

    each(paragraphStyles, function(style) {
        // Skip Root Style
        if (style.name !== "[No Paragraph Style]") {
            scaleStyle(style, scale_factor);
        }
    });

}

