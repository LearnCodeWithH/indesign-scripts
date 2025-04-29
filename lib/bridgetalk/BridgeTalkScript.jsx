/*
 * BridgeTalkScript.jsx
 * A class for building and sending scripts through BridgeTalk
 * 
 * This class provides utilities to build and send scripts to other Adobe applications
 * through BridgeTalk, particularly designed for communication with Photoshop.
 */

#include '../File.jsx';
#include './SymbolBuilder.jsx';

// Main module function using the ExtendScript-compatible pattern
function createBridgeTalkScript() {
    var VERSION = 1.0;
    
    function BridgeTalkScriptClass() {
        var bt = this;
        
        // Framework version
        bt.version = VERSION;
        bt.description = "A utility class for building BridgeTalk scripts";
        
        // Create symbol builder instance
        bt.symbolBuilder = createSymbolBuilder();
        
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
         * argsSymbolBuilder: A function that should return an array of fully encoded arguments to the function
         */
        bt.addFunctionCall = function(funcName, argsSymbolBuilder) {
            bt.scriptParts.push(bt.symbolBuilder.buildFunctionCall(funcName, argsSymbolBuilder));
            return bt; // Enable chaining
        };
        
        /**
         * Creates a variable assignment for a hash
         * valueSymbolBuilder: A function that should return the fully encoded value for the variable assignment
         */
        bt.addVariableAssign = function(varName, valueSymbolBuilder) {
            bt.scriptParts.push(bt.symbolBuilder.buildVariableAssign(varName, valueSymbolBuilder));
            return bt; // Enable chaining
        };
        
        /**
         * Adds a function definition to the script
         * funcName: The name of the function
         * argNames: An array of argument names
         * linesSymbolBuilder: A function that should return an array of fully encoded lines for the function body
         */
        bt.addFunction = function(funcName, argNames, linesSymbolBuilder) {
            bt.scriptParts.push(bt.symbolBuilder.buildFunction(funcName, argNames, linesSymbolBuilder));
            return bt; // Enable chaining
        };
        
        /**
         * Gets the complete script
         * Replaces escaped quotes (\") with concatenated expressions (" + '"' + ") to avoid BridgeTalk escaping issues
         */
        bt.buildScript = function() {
            var script = bt.scriptParts.join('\r');
            // Replace escaped quotes with string concatenation
            return script.replace(/\\"/g, '" + \'"\' + "');
        };
        
        /**
         * Sends the script to Photoshop
         */
        bt.sendToPhotoshop = function(onResult, onError, timeout) {
            var bridgetalk = new BridgeTalk();
            bridgetalk.target = "photoshop";
            // Bridgetalk handles script as json, which escapes '\"' into '\\"'
            bridgetalk.body = bt.buildScript();
            
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
                return file.write(bt.buildScript());
            });
        };
    }
    
    // Return a new instance of the script builder
    return new BridgeTalkScriptClass();
}
