//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

#include './Messages.jsx';
#include './Functional.jsx';
#include './File.jsx';

function ensureFirstGraphicInLayer(graphics, layer, func) {
    first_graphic = first(graphics, function(graphic) {
        return graphic.itemLayer === layer;
    })
    if (first_graphic !== null){
		return func(first_graphic);
	}
	else{
		alert(MSG_NO_GRAPHIC_IN_SELECTED);
	}
}

function ensureFirstGraphicInLayerSilent(graphics, layer, func) {
    first_graphic = first(graphics, function(graphic) {
        return graphic.itemLayer === layer;
    })
    if (first_graphic !== null){
		return func(first_graphic);
	}
}

function ensureFirstSelectedItem(items, func) {
    if (items !== null && items.length > 0) {
        return func(items[0]);
    } else {
        alert(MSG_NO_ITEM_SELECTED);
    }
}

function ensureDocument(func) {
    if (app.documents.length != 0){
		return func();
	}
	else{
		alert(MSG_ACTIVE_SPREAD_NO_ITEMS);
	}
}

function ensurePage(func) {
    if (app.activeWindow.activeSpread.pageItems.length != 0){
        return func();
    }
    else {
        alert(MSG_NO_DOCUMENT_OPEN);
    }
}

function ensureSaveFileViaDialogue(file_prompt, file_filter, default_file_location, func) {
    save_file = null;
    if (default_file_location !== null) {
        default_file_location = resolveFileThroughAliases(default_file_location);        
        save_file = default_file_location.saveDlg(file_prompt, file_filter);
    }
    else {
        save_file = File.saveDialogue(file_prompt, file_filter);
    }

    if (save_file !== null){
        return func(save_file);
    }
    else {
        alert(MSG_FILE_CANCELLED);
    }
}