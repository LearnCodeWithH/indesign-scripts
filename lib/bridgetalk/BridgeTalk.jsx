// Helper functions to more easily render BridgeTalk calls
// Bridgetalk requires building the script sent for execution as a string.

#include '../Functional.jsx';

function readFileForScript(full_file_path) {
    var script_utf8 = usingFile(new File(full_file_path), "r", function(script_file) {
        return script_file.read();
    });
    // TODO: I don't think this is needed.
    // var script_decoded = File.decode(script_utf8);
    return script_utf8;
}

// Outputs a pure script string, types can no longer be distinguished.
function buildFunctionCallForScript(func_name, args_symbol_array) {
    var function_left = func_name + "("
    var function_right = ");"
    var args_block = map(args_symbol_array, function(arg_symbol) {
        return encodeValueSymbolByType(arg_symbol);
    }).join(',');
    return function_left + args_block + function_right;
}

// Outputs a pure script string, types can no longer be distinguished.
function buildVariableHashForScript(var_name, hash_entries_array) {
    var var_assign = "var " + var_name + " = ";
    return var_assign + encodeValueSymbolByType(anonymousHashSymbol(hash_entries_array));
}

// Outputs a symbol containing type information.
function anonymousHashSymbol(hash_entries_array) {
    var hash_left = "{"
    var hash_right = "}"

    var hash_entries_block = map(hash_entries_array, function(entry) {
        var key = entry[0];
        var value = entry[1];
        return hashKeyValue(key, value);
    }).join(',');
    return {
        type_name: "hashmap",
        value: hash_left + hash_entries_block + hash_right
    };
}

// Outputs a symbol containing type information.
function stringSymbol(str) {
    return {
        type_name: "string",
        value: str
    };
}

function hashEntriesArrayByField(hashmap, field_array) {
    return map(field_array, function(field) {
        return [field, hashmap[field]];
    });
}

// Encoding pure values
function hashKeyValue(key, value) {
    return quoteString(key) + ": " + quoteValueByType(value);
}

function quoteValueByType(value) {
    if (typeof(value) == "string") {
        return quoteString(value);
    } else {
        return value;
    }
}

function quoteString(str) {
    return "\"" + str + "\""
}

// Encoding Symbols
function encodeValueSymbolByType(valueSymbol) {
    if (valueSymbol.type_name == "string") {
        return encodeValueAsString(valueSymbol.value);
    } else {
        return encodeValueAsObject(valueSymbol.value);
    }
}

function encodeValueAsString(symbol) {
    return "\"" + symbol + "\""
}

function encodeValueAsObject(value) {
    return value;
}

// Script manipulation
function stitchScripts(script_text_array) {
    return script_text_array.join('\r');
}

// Working with Bridgetalk
function sendScriptToPhotoshop(script_text) {
    var bridgetalk = new BridgeTalk();  
    bridgetalk.target = "photoshop";

    // Fully stitched script into one string.
    bridgetalk.body = script_text;
    
    bridgetalk.onResult = function(resObj) { 
        //$.writeln("Returned from Photoshop: " + resObj.body)
        bridgetalk = null;
    }  

    bridgetalk.onError = function( from_bridgetalk ) { 
        alert(from_bridgetalk.body); 
    };  

    bridgetalk.onTimeout = function( from_bridgetalk ) { 
        alert(from_bridgetalk.body); 
    };  
    
    // Async message handoff to Photoshop, ID script will end.
    bridgetalk.send(8); 
} 