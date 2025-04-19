/*
 * BridgeTalkScript.jsx
 * A class for building and sending scripts through BridgeTalk
 * 
 * This class provides utilities to build and send scripts to other Adobe applications
 * through BridgeTalk, particularly designed for communication with Photoshop.
 */

#include '../File.jsx';
#include '../Functional.jsx';

// Main module function using the ExtendScript-compatible pattern
function createBridgeTalkScript() {
    var VERSION = 1.0;
    
    function BridgeTalkScriptClass() {
        var bt = this;
        
        // Framework version
        bt.version = VERSION;
        bt.description = "A utility class for building BridgeTalk scripts";
        
        // Script fragments
        bt.scriptParts = [];
        
        /**
         * Adds a file's content to the script
         */
        bt.addFile = function(filePath) {
            var fileContent = bt.readFileForScript(filePath);
            bt.scriptParts.push(fileContent);
            return bt; // Enable chaining
        };
        
        /**
         * Adds raw script text
         */
        bt.addScript = function(scriptText) {
            bt.scriptParts.push(scriptText);
            return bt; // Enable chaining
        };
        
        /**
         * Reads file content for inclusion in script
         */
        bt.readFileForScript = function(fullFilePath) {
            var scriptUtf8 = usingFile(new File(fullFilePath), "r", function(scriptFile) {
                return scriptFile.read();
            });
            return scriptUtf8;
        };
        
        /**
         * Builds a function call as script text
         */
        bt.buildFunctionCall = function(funcName, argsArray) {
            var functionLeft = funcName + "(";
            var functionRight = ");";
            var argsBlock = map(argsArray, function(argSymbol) {
                return bt.encodeValueSymbolByType(argSymbol);
            }).join(',');
            var callScript = functionLeft + argsBlock + functionRight;
            bt.scriptParts.push(callScript);
            return bt; // Enable chaining
        };
        
        /**
         * Creates a variable assignment for a hash
         */
        bt.buildVariableHash = function(varName, hashEntriesArray) {
            var varAssign = "var " + varName + " = ";
            var hashValue = bt.encodeValueSymbolByType(bt.anonymousHashSymbol(hashEntriesArray));
            var varScript = varAssign + hashValue + ";";
            bt.scriptParts.push(varScript);
            return bt; // Enable chaining
        };
        
        /**
         * Creates a symbol representing a hash
         */
        bt.anonymousHashSymbol = function(hashEntriesArray) {
            var hashLeft = "{";
            var hashRight = "}";
            
            try {
                var hashEntriesBlock = map(hashEntriesArray, function(entry) {
                    var key = entry[0];
                    var value = entry[1];
                    return bt.hashKeyValue(key, value);
                }).join(',');
                
                return {
                    type_name: "hashmap",
                    value: hashLeft + hashEntriesBlock + hashRight
                };
            } catch (e) {
                throw new Error("Error creating hash symbol: " + e.message + " for " + hashEntriesArray);
            }
        };
        
        /**
         * Creates a symbol representing an array of hashes
         */
        bt.anonymousHashArraySymbol = function(arrayOfObjects) {
            var arrayLeft = "[";
            var arrayRight = "]";
            
            var hashArrayBlock = map(arrayOfObjects, function(obj) {
                var entries = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        entries.push([key, obj[key]]);
                    }
                }
                var hashSymbol = bt.anonymousHashSymbol(entries);
                return hashSymbol.value;
            }).join(',');
            
            return {
                type_name: "array",
                value: arrayLeft + hashArrayBlock + arrayRight
            };
        };
        
        /**
         * Creates a symbol representing a string
         */
        bt.stringSymbol = function(str) {
            return {
                type_name: "string",
                value: str
            };
        };
        
        /**
         * Encodes a key-value pair for a hash
         */
        bt.hashKeyValue = function(key, value) {
            return bt.quoteString(key) + ": " + bt.encodeValueRecursively(value);
        };
        
        /**
         * Creates hash entries from an object's fields
         */
        bt.hashEntriesArrayByField = function(hashmap, fieldArray) {
            return map(fieldArray, function(field) {
                return [field, hashmap[field]];
            });
        };
        
        /**
         * Recursively encodes a value for script representation
         */
        bt.encodeValueRecursively = function(value) {
            if (value === null || value === undefined) {
                return "null";
            }
            
            if (typeof value === "string") {
                return bt.quoteString(value);
            }
            
            if (typeof value === "number" || typeof value === "boolean") {
                return value.toString();
            }
            
            if (value.constructor && value.constructor === Array) {
                return bt.encodeArray(value);
            }
            
            if (typeof value === "object") {
                // Handle objects that are already symbols
                if (value.type_name && value.value) {
                    return bt.encodeValueSymbolByType(value);
                }
                
                // Convert regular objects to hash entries
                var entries = [];
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        entries.push([key, value[key]]);
                    }
                }
                return bt.anonymousHashSymbol(entries).value;
            }
            
            return value;
        };
        
        /**
         * Encodes an array for script representation
         */
        bt.encodeArray = function(arr) {
            var arrayItems = map(arr, function(item) {
                return bt.encodeValueRecursively(item);
            });
            return "[" + arrayItems.join(",") + "]";
        };
        
        /**
         * Quotes a string for script representation
         */
        bt.quoteString = function(str) {
            var escapedStr = str.toString()
                .replace(/\"/g, "\\\"")
                .replace(/\n/g, "\\n")      // Line feed
                .replace(/\r/g, "\\r")      // Carriage return
                .replace(/\t/g, "\\t");     // Tab
            return "\"" + escapedStr + "\"";
        };
        
        /**
         * Encodes a value symbol by its type
         */
        bt.encodeValueSymbolByType = function(valueSymbol) {
            if (valueSymbol.type_name == "string") {
                return bt.encodeValueAsString(valueSymbol.value);
            } else {
                return bt.encodeValueAsObject(valueSymbol.value);
            }
        };
        
        /**
         * Encodes a value as a string
         */
        bt.encodeValueAsString = function(symbol) {
            return "\"" + symbol + "\"";
        };
        
        /**
         * Encodes a value as an object
         */
        bt.encodeValueAsObject = function(value) {
            return value;
        };
        
        /**
         * Gets the complete script
         */
        bt.getScript = function() {
            return bt.scriptParts.join('\r');
        };
        
        /**
         * Sends the script to Photoshop
         */
        bt.sendToPhotoshop = function(onResult, onError, timeout) {
            var bridgetalk = new BridgeTalk();
            bridgetalk.target = "photoshop";
            bridgetalk.body = bt.getScript();
            
            bridgetalk.onResult = function(result) {
                bridgetalk = null; // Clear reference to avoid memory leaks
                if (onResult) {
                    onResult(result);
                }
            };
            
            bridgetalk.onError = function(result) {
                if (onError) {
                    onError(result);
                }
                alert("Error from Photoshop: " + result.body);
            };
            
            bridgetalk.onTimeout = function(result) {
                alert("Timeout from Photoshop: " + result.body);
            };
            
            // Send with specified timeout (in seconds)
            bridgetalk.send(timeout || 60);
        };
        
        /**
         * Outputs the script to a file
         */
        bt.outputToFile = function(filePath) {
            var scriptFile = new File(filePath);
            if (scriptFile.exists) {
                scriptFile.remove();
            }
            
            scriptFile.encoding = "UTF-8";
            usingFile(scriptFile, "w", function(file) {
                return file.write(bt.getScript());
            });
        };
    }
    
    // Return a new instance of the script builder
    return new BridgeTalkScriptClass();
}
