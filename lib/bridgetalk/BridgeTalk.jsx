// Helper functions to more easily render BridgeTalk calls
// Bridgetalk requires building the script sent for execution as a string.

#include '../Functional.jsx';
#include '../DebugFileLogger.jsx';

function readFileForScript(full_file_path) {
    var script_utf8 = usingFile(new File(full_file_path), "r", function(script_file) {
        return script_file.read();
    });
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
    var hash_left = "{";
    var hash_right = "}";
    try {
        
        var hash_entries_block = map(hash_entries_array, function(entry) {
            var key = entry[0];
            var value = entry[1];
            return hashKeyValue(key, value);
        }).join(',');

        return {
            type_name: "hashmap",
            value: hash_left + hash_entries_block + hash_right
        };
    } catch (e) {
        alert(e);
        alert("Error for " + hash_entries_array);
    }
}

// Outputs a symbol containing type information for an array of hash maps
function anonymousHashArraySymbol(array_of_objects) {
    var array_left = "[";
    var array_right = "]";

    var hash_array_block = map(array_of_objects, function(obj) {        
        var entries = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                
                entries.push([key, obj[key]]);
            }
        }
        var test = anonymousHashSymbol(entries);
        return test.value;
    }).join(',');

    return {
        type_name: "array",
        value: array_left + hash_array_block + array_right
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
    return quoteString(key) + ": " + encodeValueRecursively(value);
}

function encodeValueRecursively(value) {
    if (value === null || value === undefined) {
        
        return "null";
    }
    
    if (typeof value === "string") {
        
        return quoteString(value);
    }
    
    if (typeof value === "number" || typeof value === "boolean") {
        
        return value.toString();
    }
    
    if (value.constructor && value.constructor === Array) {
        
        return encodeArray(value);
    }
    
    if (typeof value === "object") {
        
        // Handle objects that are already symbols
        if (value.type_name && value.value) {
            return encodeValueSymbolByType(value);
        }
        
        // Convert regular objects to hash entries
        var entries = [];
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                
                entries.push([key, value[key]]);
            }
        }
        return anonymousHashSymbol(entries).value;
    }
    
    
    return value;
}

function encodeArray(arr) {
    var array_items = map(arr, function(item) {
        return encodeValueRecursively(item);
    });
    return "[" + array_items.join(",") + "]";
}

function quoteValueByType(value) {
    return encodeValueRecursively(value);
}

function quoteString(str) {
    // Replace any quotes in the string with escaped quotes
    var escapedStr = str.toString().replace(/\"/g, "\\\"");
    return "\"" + escapedStr + "\"";
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
    
    bridgetalk.onResult = function(bridgetalk_result) { 
        bridgetalk = null;
    }  

    bridgetalk.onError = function( bridgetalk_result ) { 
        alert("Error from Photoshop: " + bridgetalk_result.body); 
    };  

    bridgetalk.onTimeout = function( bridgetalk_result ) { 
        alert("Timeout from Photoshop: " + bridgetalk_result.body); 
    };  
    
    // Synchroneous send, timeout in seconds.
    bridgetalk.send(60); 
}