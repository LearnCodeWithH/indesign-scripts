#include './Messages.jsx';
#include './Functional.jsx';

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