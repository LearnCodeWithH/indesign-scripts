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
