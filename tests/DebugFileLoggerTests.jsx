/*
 * DebugFileLogger Tests
 * 
 * This script tests the functionality of the DebugFileLogger module
 * ExtendScript version: 4.5+ (InDesign CC and later)
 */

#target indesign
#include './framework/TestFramework.jsx';
#include '../lib/DebugFileLogger.jsx';
#include '../lib/File.jsx';

// Create a test runner with file logging
var runner = createTestRunner({
    logFileName: "DebugFileLoggerTests.log"
});

// Display script engine information in setup
runner.setBeforeAll(function() {
    var infoStr = "ExtendScript Test Environment:\n";
    infoStr += "ExtendScript version: " + $.version + "\n";
    infoStr += "ExtendScript build: " + $.build + "\n";
    infoStr += "Target application: " + BridgeTalk.appName + "\n";
    infoStr += "Application version: " + app.version;
    
    runner.output(infoStr);
});

// Setup temporary test folder for files
var tempBasePath = new File($.fileName).parent + "/temp_test/";
var tempFolder = new Folder(tempBasePath);
if (!tempFolder.exists) {
    tempFolder.create();
}

// Test-specific variables
var testLogger = null;
var testLogFile = null;
var cleanUpTestFiles = true;

// Add a cleanup hook to remove the temp folder at the end
runner.setAfterAll(function() {
    try {
        // Ensure the logger is closed
        if (testLogger) {
            testLogger.close();
        }
        
        if (cleanUpTestFiles) {
            // Clean up the temp folder
            var files = tempFolder.getFiles();
            for (var i = 0; i < files.length; i++) {
                files[i].remove();
            }
            tempFolder.remove();
        }
    } catch (e) {
        $.writeln("WARNING: Could not clean up after tests: " + e.message);
    }
});

// Setup for each test
runner.setBeforeEach(function() {
    // Create a new logger for each test with the temp folder path
    testLogger = createDebugLogger("test_debug.log", tempBasePath);
    testLogFile = new File(tempBasePath + "test_debug.log");
});

// Cleanup after each test
runner.setAfterEach(function() {
    if (testLogger) {
        testLogger.close();
        testLogger = null;
    }
    
    if (cleanUpTestFiles) {
        // Remove the test log file if it exists
        if (testLogFile && testLogFile.exists) {
            testLogFile.remove();
        }
    }
});

// Helper function to read a file's contents
function readFileContents(file) {
    return usingFile(file, "r", function(f) {
        return f.read();
    });
}

// Test logger initialization
runner.addTest("Test logger initialization", function(test) {
    // Verify the log file exists after initialization
    test.assertTrue(testLogFile.exists, "Log file should be created on initialization");
    
    // Force flush for initialization via writing a message
    testLogger.write("Force flush to file");

    // Verify the log file has header content
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("=== Debug Log Started:") !== -1, "Log file should contain start header");
    test.assertTrue(content.indexOf("Script:") !== -1, "Log file should contain script name");
});

// Test baseFolderPath parameter
runner.addTest("Test baseFolderPath parameter", function(test) {
    // Create a custom subfolder in the temp directory
    var customBasePath = tempBasePath + "custom_folder/";
    var customSubfolder = new Folder(customBasePath);
    if (!customSubfolder.exists) {
        customSubfolder.create();
    }
    
    // Create logger with custom folder path
    var customLogger = createDebugLogger("custom_log.log", customBasePath);
    var expectedLogFile = new File(customSubfolder.fsName + "/custom_log.log");
    
    // Verify file was created in the right location
    test.assertTrue(expectedLogFile.exists, "Log file should be created in the specified base folder");
    
    // Clean up
    customLogger.close();
    if (expectedLogFile.exists) {
        expectedLogFile.remove();
    }
    if (customSubfolder.exists) {
        customSubfolder.remove();
    }
});

// Test default location when baseFolderPath is not provided
runner.addTest("Test default location when baseFolderPath is null", function(test) {
    // Create a temporary logger in current directory
    var defaultLocationLogger = createDebugLogger("temp_default_log.log");
    var expectedDefaultFile = new File(defaultLocationLogger.logFilePath);
    
    // Verify file was created in the script directory
    test.assertTrue(expectedDefaultFile.exists, "Log file should be created in script directory when baseFolderPath not provided");
    
    // Clean up
    defaultLocationLogger.close();
    if (expectedDefaultFile.exists) {
        expectedDefaultFile.remove();
    }
});

// Test writing simple messages
runner.addTest("Test write function", function(test) {
    // Write a simple message
    var testMessage = "This is a test message";
    testLogger.write(testMessage);
    
    // Verify the message was written
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf(testMessage) !== -1, "Log file should contain the written message");
    
    // Verify timestamp format
    var timestampPattern = /\[\d{2}-\d{2}-\d{2}(AM|PM)\]/;
    test.assertTrue(timestampPattern.test(content), "Log should include properly formatted timestamp");
});

// Test writing messages with special characters - write function should NOT escape whitespace
runner.addTest("Test write function with special characters", function(test) {
    // Write a message with newlines and tabs
    var specialMessage = "Line 1\nLine 2\tTabbed";
    testLogger.write(specialMessage);
    
    // Verify the message was NOT escaped in the log file
    var content = readFileContents(testLogFile);
    
    // The content should contain the raw message with actual newlines and tabs
    // We expect the message to appear as-is, not escaped
    test.assertTrue(content.indexOf("Line 1\nLine 2\tTabbed") !== -1, 
        "Log file should contain the message with actual whitespace characters, not escaped");
    
    // Test with other special characters
    var moreSpecial = "Quote \"test\" and \\ backslash";
    testLogger.write(moreSpecial);
    
    content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf(moreSpecial) !== -1, 
        "Log file should contain special characters as-is");
});

// Test writeObject function with special characters - should escape properly
runner.addTest("Test writeObject with whitespace characters", function(test) {
    // Test that whitespace characters are properly escaped in object values
    var objWithWhitespace = {
        withNewline: "text\nwith newline",
        withTab: "text\twith tab",
        withReturn: "text\rwith return"
    };
    
    // The prefix should not be escaped
    var unescapedPrefix = "Prefix with\nnewline";
    testLogger.writeObject(unescapedPrefix, objWithWhitespace);
    
    // Verify the output
    var content = readFileContents(testLogFile);
    
    // The prefix should not be escaped in the log
    test.assertTrue(content.indexOf(unescapedPrefix + ":") !== -1, 
        "Log should contain unescaped prefix string");
    
    // But object values should be escaped
    test.assertTrue(content.indexOf("text\\nwith newline") !== -1, 
        "Newlines in object values should be escaped");
    test.assertTrue(content.indexOf("text\\twith tab") !== -1, 
        "Tabs in object values should be escaped");
    test.assertTrue(content.indexOf("text\\rwith return") !== -1, 
        "Carriage returns in object values should be escaped");
});

// Test writeObject function with primitive types
runner.addTest("Test writeObject with primitive types", function(test) {
    // Write different primitive values
    testLogger.writeObject("String value", "test string");
    testLogger.writeObject("Number value", 42);
    testLogger.writeObject("Boolean value", true);
    testLogger.writeObject("Null value", null);
    
    // Verify the output
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("String value:") !== -1, "Log should contain object prefix");
    test.assertTrue(content.indexOf("\"test string\"") !== -1, "Log should contain string value");
    test.assertTrue(content.indexOf("42 (number)") !== -1, "Log should contain number value with type");
    test.assertTrue(content.indexOf("true (boolean)") !== -1, "Log should contain boolean value with type");
    test.assertTrue(content.indexOf("null") !== -1, "Log should handle null values");
});

// Test writeObject function with arrays
runner.addTest("Test writeObject with arrays", function(test) {
    // Write an array
    var testArray = [1, "two", true, [3, 4]];
    testLogger.writeObject("Test Array", testArray);
    
    // Verify the output
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("Test Array:") !== -1, "Log should contain array prefix");
    test.assertTrue(content.indexOf("Array[4]:") !== -1, "Log should show array length");
    test.assertTrue(content.indexOf("[0]:") !== -1, "Log should show array indices");
    test.assertTrue(content.indexOf("1 (number)") !== -1, "Log should show number element");
    test.assertTrue(content.indexOf("\"two\"") !== -1, "Log should show string element");
    test.assertTrue(content.indexOf("Array[2]:") !== -1, "Log should show nested array");
});

// Test writeObject function with objects
runner.addTest("Test writeObject with objects", function(test) {
    // Write a complex object
    var testObj = {
        name: "Test Object",
        count: 42,
        active: true,
        nested: {
            id: 1,
            details: "More info"
        },
        items: ["one", "two", "three"]
    };
    
    testLogger.writeObject("Test Object", testObj);
    
    // Verify the output
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("Test Object:") !== -1, "Log should contain object prefix");
    test.assertTrue(content.indexOf("Object {5 properties}:") !== -1, "Log should show object properties count");
    test.assertTrue(content.indexOf("name:") !== -1, "Log should show property names");
    test.assertTrue(content.indexOf("\"Test Object\"") !== -1, "Log should show string property values");
    test.assertTrue(content.indexOf("nested:") !== -1, "Log should show nested object property");
    test.assertTrue(content.indexOf("items:") !== -1, "Log should show array property");
    test.assertTrue(content.indexOf("Array[3]:") !== -1, "Log should show nested array length");
});

// Test object recursion depth limit
runner.addTest("Test writeObject recursion depth limit", function(test) {
    // Create a deeply nested object
    var deepObj = { level: 1 };
    var current = deepObj;
    
    // Create an object with 15 levels of nesting
    for (var i = 2; i <= 15; i++) {
        current.next = { level: i };
        current = current.next;
    }
    
    // Test with default max depth (10)
    testLogger.writeObject("Deep Object Default", deepObj);
    
    // Test with custom max depth
    testLogger.writeObject("Deep Object Custom", deepObj, 5);
    
    // Verify the output
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("[MAX DEPTH REACHED]") !== -1, 
        "Log should indicate when max recursion depth is reached");
        
    // The custom depth limit should be reached earlier
    var defaultSection = content.substring(content.indexOf("Deep Object Default"), content.indexOf("Deep Object Custom"));
    var customSection = content.substring(content.indexOf("Deep Object Custom"));
    
    var defaultMaxDepthCount = defaultSection.split("level").length - 1;
    var customMaxDepthCount = customSection.split("level").length - 1;

    test.assertTrue(defaultMaxDepthCount == 10,
        "Default max depth should be 10 levels deep");
    test.assertTrue(customMaxDepthCount == 5,
        "Custom max depth should be 5 levels deep");
});

// Test logger close function
runner.addTest("Test close function", function(test) {
    // Write a message and close
    testLogger.write("Message before close");
    testLogger.close();
    
    // Verify close message was written
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("=== Debug Log Closed:") !== -1, 
        "Log file should contain closure message");
    
    // Try writing after close (should reopen and overwrite)
    testLogger.write("Message after close");
    
    // Verify new session was started
    content = readFileContents(testLogFile);
    var closeCount = content.split("=== Debug Log Closed:").length - 1;
    var startCount = content.split("=== Debug Log Started:").length - 1;
    
    test.assertEquals(0, closeCount, "Should have no close entry");
    test.assertTrue(content.indexOf("Message after close") !== -1, 
        "Writing after close should create a new log session");
});

// Test writing complex objects with circular references
runner.addTest("Test writeObject with circular references", function(test) {
    // Create an object with a circular reference
    var obj1 = { name: "Object 1" };
    var obj2 = { name: "Object 2", ref: obj1 };
    obj1.ref = obj2;  // Create circular reference
    
    // This should not cause infinite recursion due to depth limiting
    testLogger.writeObject("Circular Object", obj1);
    
    // Verify the output has reasonable size and contains expected content
    var content = readFileContents(testLogFile);
    test.assertTrue(content.indexOf("Circular Object:") !== -1, "Log should contain object prefix");
    test.assertTrue(content.indexOf("Object 1") !== -1, "Log should contain first object name");
    test.assertTrue(content.indexOf("Object 2") !== -1, "Log should contain second object name");
});

// Run all tests
runner.runTests();