//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './Functional.jsx';
#include './File.jsx';

function scriptRunScope(func) {
    try {
        return func();
    } catch (error) {
        alert(error.message);
    }
}

function requireDocument() {
    if (!app.documents || app.documents.length <= 0){
		throw new Error("No documents are open. Please open a document and try again.");
	}
}

function requirePage(doc) {
    if (!doc.pages || doc.pages.length <= 0){
        throw new Error("No pages exist in current document. Please add a page and try again.");
    }
}

function requirePageItem(pageOrDoc) {
    if (!pageOrDoc.pageItems || pageOrDoc.pageItems.length <= 0){
        throw new Error("No page items exist in current document. Please add a page item and try again.");
    }
}

function requireSelectedPageItem(doc) {
    if (!doc.selectedPageItems || doc.selectedPageItems.length <= 0) {
        throw new Error("No item selected. Please select an item and try again.");
    }
}

function requireSaveFileViaDialogue(file_prompt, file_filter, default_file_location) {
    save_file = null;
    if (default_file_location !== null) {
        default_file_location = resolveFileThroughAliases(default_file_location);        
        save_file = default_file_location.saveDlg(file_prompt, file_filter);
    }
    else {
        save_file = File.saveDialog(file_prompt, file_filter);
    }

    if (save_file !== null){
        return save_file;
    }
    else {
        throw new Error("File save cancelled. Please specify a file and try again.");
    }
}

function requireSelectFolderViaDialogue(file_prompt, default_folder_location) {
    save_folder = null;
    if (default_folder_location !== null) {
        default_folder_location = resolveFileThroughAliases(default_folder_location);        
        save_folder = default_folder_location.selectDlg(file_prompt);
    }
    else {
        save_folder = Folder.selectDialog(file_prompt);
    }

    if (save_folder !== null){
        return save_folder;
    }
    else {
        throw new Error("Folder selection cancelled. Please specify a folder and try again.");
    }
}