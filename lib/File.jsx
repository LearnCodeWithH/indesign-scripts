//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

function usingFile(file, mode, func) {
    file.open(mode);
    try {
        return func(file);
    } finally {
        file.close();
    }
}

// Opened files already have aliases resolved: https://www.indesignjs.de/extendscriptAPI/indesign-latest/index.html#File.html#d1e6347__d1e7098
function resolveFileThroughAliases(file) {
    while (file.alias) {
        file = file.resolve();
    }
    return file;
}