//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

/**
 * DebugFileLogger - Simple file-based logger for debugging ExtendScript
 * Creates a log file in the current directory for debug output
 */

// Include date/time helper functions for timestamps
// TODO: Uncomment after testing
// #include './Datetime.jsx';
// #include './Functional.jsx';

/**
 * Creates a new debug file logger
 * @param {string} filename - Optional custom log filename (defaults to "debug_output.log")
 * @param {string} baseFolderPath - Optional folder path for log file (defaults to current script directory)
 * @return {Object} Logger instance with write and close methods
 */
function createDebugLogger(filename, baseFolderPath) {
    var logger = {};
    
    // Default parameters
    filename = filename || "debug_output.log";
    
    // Store current script's directory as the default location
    var scriptFile = new File($.fileName);
    var currentDir = scriptFile.parent.fsName + "/";
    
    // Use provided base folder or default to current directory
    var baseDir = baseFolderPath || currentDir;
    var logFilePath = baseDir + filename;
    logger.logFilePath = logFilePath;
    
    // File handle for the log
    var logFile = null;
    
    /**
     * Initialize the log file
     * @private
     */
    function initLogFile() {
        try {
            logFile = new File(logFilePath);
            logFile.encoding = "UTF-8";
            
            if (logFile.open("w")) {
                // Add header to the new file
                logFile.writeln("=== Debug Log Started: " + new Date().toString() + " ===");
                logFile.writeln("Script: " + scriptFile.displayName);
                logFile.writeln("----------------------------------------");
                return true;
            } else {
                alert("Could not open log file at: " + logFilePath);
                return false;
            }
        } catch (e) {
            alert("Error initializing debug logger: " + e.message + " @" + e.file + ":" + e.line);
            return false;
        }
    }
    
    /**
     * Write a message to the log file with timestamp
     * @param {string} message - The message to write
     */
    logger.write = function(message) {
        if (!logFile || !logFile.exists) {
            if (!initLogFile()) return;
        }
        
        try {
            // Always add timestamp
            var now = new Date();
            var timestamp = "[" + timeString(now) + "] ";
            
            // Escape any newlines or special characters in the message
            var logMessage = timestamp + message;
            
            logFile.writeln(logMessage);
            // Flush immediately for debugging
            logFile.close();
            logFile.open("a");
        } catch (e) {
            alert("Error writing to log: " + e.message + " @" + e.file + ":" + e.line);
        }
    };
    
    /**
     * Write an object to the log file with detailed inspection
     * @param {string} prefix - Message prefix to describe the object
     * @param {any} obj - The object, array or primitive to inspect
     * @param {number} [maxDepth=10] - Maximum recursion depth
     * @param {Array} [excludeObjectProperties=[]] - Array of property names to exclude from detailed inspection
     */
    logger.writeObject = function(prefix, obj, maxDepth, excludeObjectProperties) {
        if (!logFile || !logFile.exists) {
            if (!initLogFile()) return;
        }
        
        // Default max depth to prevent infinite recursion with circular references
        maxDepth = (typeof maxDepth === 'number') ? maxDepth : 10;
        
        // Default excludeObjectProperties to an empty array if not provided
        excludeObjectProperties = (excludeObjectProperties instanceof Array) ? excludeObjectProperties : [];
        
        try {
            // Generate timestamp prefix
            var now = new Date();
            var timestamp = "[" + timeString(now) + "] ";
            
            // Write the initial message with the prefix
            logFile.writeln(timestamp + prefix + ":");
            
            // Start the recursive inspection with initial indentation
            inspectAndWrite(obj, "  ", 0, maxDepth, excludeObjectProperties);
            
            // Flush immediately for debugging
            logFile.close();
            logFile.open("a");
        } catch (e) {
            alert("Error writing object to log: " + e.message + " @" + e.file + ":" + e.line);
        }
    };
    
    /**
     * Helper function to recursively inspect and write object contents
     * @private
     */
    function inspectAndWrite(value, indent, depth, maxDepth, excludeObjectProperties) {
        if (depth >= maxDepth) {
            logFile.writeln(indent + "[MAX DEPTH REACHED]");
            return;
        }
        
        // Handle different value types
        if (value === null) {
            logFile.writeln(indent + "null");
            return;
        }
        
        if (value === undefined) {
            logFile.writeln(indent + "undefined");
            return;
        }
        
        var valueType = typeof value;
        
        if (valueType === "function") {
            // For functions, just show that it's a function and its name if available
            var funcName = value.name || "[anonymous]";
            logFile.writeln(indent + "function " + funcName + "()");
            return;
        }
        
        if (valueType !== "object") {
            // For primitive types (string, number, boolean)
            if (valueType === "string") {
                // Escape newlines and other control characters in strings
                var escapedValue = escapeString(value);
                logFile.writeln(indent + "\"" + escapedValue + "\" (string)");
            } else {
                logFile.writeln(indent + value + " (" + valueType + ")");
            }
            return;
        }
        
        // Handle Enumerator values (InDesign/ExtendScript enum values)
        if (value.constructor && value.constructor.name === "Enumerator") {
            try {
                // Simply print the enum value using toString()
                var enumStr = value.toString();
                logFile.writeln(indent + "Enum: " + enumStr);
            } catch (enumError) {
                logFile.writeln(indent + "Enum: [Error getting enum value: " + enumError.message + "]");
            }
            return;
        }
        
        // Handle arrays
        if (value instanceof Array) {
            logFile.writeln(indent + "Array[" + value.length + "]:");
            for (var i = 0; i < value.length; i++) {
                logFile.writeln(indent + "  [" + i + "]:");
                inspectAndWrite(value[i], indent + "    ", depth + 1, maxDepth, excludeObjectProperties);
            }
            return;
        }
        
        // Handle objects
        try {
            // Get object type/class name if possible
            var typeName = value.constructor ? value.constructor.name : "Object";
            
            // Try to get all properties
            var props = [];
            var excludedProps = [];
            
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    if (!any(excludeObjectProperties, function(excludeProp) { return key === excludeProp; })) {
                        props.push(key);
                    } else {
                        excludedProps.push(key);
                    }
                }
            }
            
            var totalProps = props.length + excludedProps.length;
            logFile.writeln(indent + typeName + " {" + totalProps + " properties" + 
                (excludedProps.length > 0 ? ", " + excludedProps.length + " excluded" : "") + "}:");
            
            // Write each property
            for (var p = 0; p < props.length; p++) {
                var propName = props[p];
                var propDesc;
                
                try {
                    // Try to get the property safely (might throw for some ExtendScript objects)
                    var propValue = value[propName];
                    logFile.writeln(indent + "  " + propName + ":");
                    inspectAndWrite(propValue, indent + "    ", depth + 1, maxDepth, excludeObjectProperties);
                } catch (propError) {
                    // Some properties may throw when accessed in ExtendScript
                    logFile.writeln(indent + "  " + propName + ": [ERROR: " + propError.message + "]");
                }
            }
            
            // Write excluded properties
            for (var e = 0; e < excludedProps.length; e++) {
                var excludedProp = excludedProps[e];
                logFile.writeln(indent + "  " + excludedProp + ": [EXCLUDED BY FILTER]");
            }
        } catch (objError) {
            // If anything goes wrong accessing the object
            logFile.writeln(indent + "[Error inspecting object: " + objError.message + "]");
        }
    }

    /**
     * Escapes special characters in a string for log file output
     * @private
     * @param {string} str - The string to escape
     * @return {string} The escaped string
     */
    function escapeString(str) {
        if (!str) return "";
        
        return str
            .replace(/\n/g, "\\n")      // Line feed
            .replace(/\r/g, "\\r")      // Carriage return
            .replace(/\t/g, "\\t");     // Tab
    }

    /**
     * Close the log file
     */
    logger.close = function() {
        try {
            if (logFile && logFile.exists) {
                logFile.writeln("\n=== Debug Log Closed: " + new Date().toString() + " ===");
                logFile.close();
                logFile = null;
            }
        } catch (e) {
            alert("Error closing log file: " + e.message + " @" + e.file + ":" + e.line);
        }
    };
    
    // Initialize the log file when the logger is created
    initLogFile();
    
    return logger;
}

/**
 * Singleton instance for quick access
 * Use this for simple debug logging without managing the logger instance
 */
var DebugLogger = createDebugLogger();
