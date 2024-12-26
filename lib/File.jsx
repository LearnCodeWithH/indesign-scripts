//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

const MSG_FILE_NOT_OPENED = "File could not be opened.";

function usingFile(file, mode, func) {
    if (file.open(mode)) {
        try {
            return func(file);
        } finally {
            file.close();
        }
    } else {
        alert(MSG_FILE_NOT_OPENED + " " + file.fsName);
    }
}

// Opened files already have aliases resolved: https://www.indesignjs.de/extendscriptAPI/indesign-latest/index.html#File.html#d1e6347__d1e7098
function resolveFileThroughAliases(file) {
    while (file.alias) {
        file = file.resolve();
    }
    return file;
}

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
