/*
 * SymbolBuilder.jsx
 * A utility class for building symbols and encoding values for BridgeTalk scripts
 */

#include '../Functional.jsx';

function createSymbolBuilder() {
    var VERSION = 1.0;
    
    function SymbolBuilderClass() {
        var sb = this;
        
        // Framework version
        sb.version = VERSION;
        sb.description = "A utility class for building extendscript symbols for BridgeTalk scripts";
        
        /**
         * Projects an object to a hash by provided keys
         * strictObjectKeys: If true, only keys in the object will be included
         */
        sb.projectObjectByKeys = function(obj, keys, strictObjectKeys) {
            var strictness = strictObjectKeys || false;
            var hash = {};
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (obj.hasOwnProperty(key)) {
                    hash[key] = obj[key];
                } else if (!strictness) {
                    hash[key] = null; // Assign null if key not found in object
                }
            }
            return hash;
        };

        /**
         * Creates a symbol representing a hash
         */
        sb.encodeAnonymousHash = function(hashMap, keys) {
            var hashLeft = "{";
            var hashRight = "}";
            
            var hashEntriesBlock = map(keys, function(key) {
                return sb.encodeKeyValue(key, hashMap[key]);
            }).join(',');
            
            return hashLeft + hashEntriesBlock + hashRight;
        };
        
        /**
         * Encodes a key-value pair for a hash
         */
        sb.encodeKeyValue = function(key, value) {
            return sb.encodeString(key) + ": " + sb.buildValue(value);
        };
        
        /**
         * Encodes an array for script representation
         */
        sb.encodeArray = function(arr) {
            var arrayItems = map(arr, function(item) {
                return sb.buildValue(item);
            });
            return "[" + arrayItems.join(",") + "]";
        };
        
        /**
         * Quotes a string for script representation
         */
        sb.encodeString = function(str) {
            var escapedStr = str.toString()
                .replace(/\"/g, "\\\"")
                .replace(/\n/g, "\\n")      // Line feed
                .replace(/\r/g, "\\r")      // Carriage return
                .replace(/\t/g, "\\t");     // Tab
            return "\"" + escapedStr + "\"";
        };

        /**
         * Encodes a value as an object
         */
        sb.buildValue = function(value) {
            if (value === null || value === undefined) {
                return "null";
            }
            
            if (typeof value === "string") {
                return sb.encodeString(value);
            }
            
            if (typeof value === "number" || typeof value === "boolean") {
                return value.toString();
            }
            
            if (value.constructor && value.constructor === Array) {
                return sb.encodeArray(value);
            }
            
            if (typeof value === "object") {
                // Convert regular objects to hash entries
                var keys = [];
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                return sb.encodeAnonymousHash(value, keys);
            }
            
            return value;
        };

        /**
         * Builds a function call as script text
         * argsSymbolBuilder: A function that should return an array of fully encoded arguments to the function
         */
        sb.buildFunctionCall = function(funcName, argsSymbolBuilder) {
            var functionLeft = funcName + "(";
            var functionRight = ");";
            var argsSymbol = argsSymbolBuilder(sb).join(",");
            var callScript = functionLeft + argsSymbol + functionRight;
            return callScript; 
        };

        /**
         * Creates a variable assignment for a hash
         * valueSymbolBuilder: A function that should return the fully encoded value for the variable assignment
         */
        sb.buildVariableAssign = function(varName, valueSymbolBuilder) {
            var varAssign = "var " + varName + " = ";
            var valueSymbol = valueSymbolBuilder(sb);
            var varScript = varAssign + valueSymbol + ";";
            return varScript;
        };
    }
    
    // Return a new instance of the symbol builder
    return new SymbolBuilderClass();
}