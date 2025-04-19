/*
 * BridgeTalk Script Tests
 * 
 * This script tests the functionality in BridgeTalkScript.jsx
 * ExtendScript version: 4.5+ (InDesign CC and later)
 */

#target indesign
#include './framework/TestFramework.jsx';
#include '../lib/bridgetalk/BridgeTalkScript.jsx';

// Create a test runner with file logging
var runner = createTestRunner({
    logFileName: "BridgeTalkScriptTests.log"
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

// Add a cleanup hook to remove the temp folder at the end
runner.setAfterAll(function() {
    try {
        // Clean up the temp folder
        var files = tempFolder.getFiles();
        for (var i = 0; i < files.length; i++) {
            files[i].remove();
        }
        tempFolder.remove();
    } catch (e) {
        runner.output("WARNING: Could not remove temp folder: " + e.message);
    }
});

// Create a new BridgeTalkScript instance for testing
var btScript = createBridgeTalkScript();

// Test the version and description properties
runner.addTest("Test BridgeTalkScript properties", function(test) {
    test.assertTrue(btScript.version > 0, "Version should be defined");
    test.assertTrue(btScript.description && btScript.description.length > 0, "Description should be defined");
    test.assertTrue(btScript.symbolBuilder !== null, "Should have a symbolBuilder instance");
});

// Test addFunctionCall
runner.addTest("Test addFunctionCall method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Test with no arguments
    btScript.addFunctionCall("testFunc", function(sb) { return []; });
    test.assertEquals("testFunc();", btScript.scriptParts[0], "Function call with no args should be formatted correctly");
    
    // Reset script parts
    btScript.scriptParts = [];
    
    // Test with simple arguments
    btScript.addFunctionCall("testFunc", function(sb) { return [sb.buildValue("hello"), sb.buildValue(42)]; });
    test.assertEquals("testFunc(\"hello\",42);", btScript.scriptParts[0], "Function call with args should be formatted correctly");
    
    // Reset script parts
    btScript.scriptParts = [];
    
    // Test with complex arguments
    btScript.addFunctionCall("complexFunc", function(sb) { 
        return [sb.buildValue("hello"), sb.buildValue({"name":"John","age":30})];
    });
    
    var complexResult = btScript.scriptParts[0];
    test.assertTrue(complexResult.indexOf("complexFunc(\"hello\",{") === 0, "Complex function call should start correctly");
    test.assertTrue(complexResult.indexOf("\"name\": \"John\"") > -1, "Complex function call should include object properties");
});

// Test addVariableAssign
runner.addTest("Test addVariableAssign method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Test with empty hash
    btScript.addVariableAssign("emptyVar", function(sb) { return sb.buildValue({}); });
    test.assertEquals("var emptyVar = {};", btScript.scriptParts[0], "Variable with empty hash should be formatted correctly");
    
    // Reset script parts
    btScript.scriptParts = [];
    
    // Test with simple entries
    btScript.addVariableAssign("testVar", function(sb) { 
        return sb.buildValue({"name":"John","age":30});
    });
    
    var result = btScript.scriptParts[0];
    test.assertTrue(result.indexOf("var testVar = {") === 0, "Variable hash should start with correct declaration");
    test.assertTrue(result.indexOf("\"name\": \"John\"") > -1, "Variable hash should contain key 'name'");
    test.assertTrue(result.indexOf("\"age\": 30") > -1, "Variable hash should contain value 'age'");
    
    // Test method chaining
    btScript.scriptParts = [];
    var chainResult = btScript.addVariableAssign("chainVar", function(sb) { return sb.buildValue({}); });
    test.assertTrue(chainResult === btScript, "Method should return the instance for chaining");
});

// Test addScript method
runner.addTest("Test addScript method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Test adding simple script
    btScript.addScript("var x = 1;");
    test.assertEquals("var x = 1;", btScript.scriptParts[0], "addScript should add script text to parts array");
    
    // Test adding multiple scripts
    btScript.addScript("var y = 2;");
    test.assertEquals("var y = 2;", btScript.scriptParts[1], "addScript should add multiple script parts");
    
    // Test chaining
    var result = btScript.addScript("var z = 3;");
    test.assertTrue(result === btScript, "Method should return the instance for chaining");
});

// Test readFileForScript
runner.addTest("Test readFileForScript function", function(test) {
    // Create a temp file to read
    var tempFilePath = tempBasePath + "testScript.jsx";
    var testFile = new File(tempFilePath);
    testFile.encoding = "UTF-8";
    
    // Write some content to the file
    if (testFile.open("w")) {
        testFile.write("var testVar = 'Hello World';");
        testFile.close();
    }
    
    // Test reading the file
    var fileContent = btScript.readFileForScript(tempFilePath);
    test.assertEquals("var testVar = 'Hello World';", fileContent, "readFileForScript should correctly read file content");
});

// Test addFile method
runner.addTest("Test addFile method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Create a temp file to include
    var tempFilePath = tempBasePath + "includeScript.jsx";
    var testFile = new File(tempFilePath);
    testFile.encoding = "UTF-8";
    
    // Write some content to the file
    if (testFile.open("w")) {
        testFile.write("function testFunction() { return 'test'; }");
        testFile.close();
    }
    
    // Add the file to the script
    btScript.addFile(tempFilePath);
    
    // Test that the file content was added
    test.assertEquals("function testFunction() { return 'test'; }", btScript.scriptParts[0], 
        "addFile should add file content to script parts");
    
    // Test chaining
    var result = btScript.addFile(tempFilePath);
    test.assertTrue(result === btScript, "addFile should return the BridgeTalkScript object for chaining");
});

// Test the buildScript method
runner.addTest("Test buildScript method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Add multiple script parts
    btScript.addScript("var x = 1;");
    btScript.addScript("var y = 2;");
    btScript.addScript("alert(x + y);");
    
    // Test the combined script
    var expected = "var x = 1;\rvar y = 2;\ralert(x + y);";
    test.assertEquals(expected, btScript.buildScript(), "buildScript should join script parts with CR separator");
});

// Test the outputToFile method
runner.addTest("Test outputToFile method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Add script content
    btScript.addScript("var x = 'test output';");
    btScript.addScript("alert(x);");
    
    // Output to file
    var outputPath = tempBasePath + "outputScript.jsx";
    btScript.outputToFile(outputPath);
    
    // Read the file back and verify content
    var outputFile = new File(outputPath);
    outputFile.encoding = "UTF-8";
    var content = "";
    
    if (outputFile.open("r")) {
        content = outputFile.read();
        outputFile.close();
    }
    
    var expected = "var x = 'test output';\nalert(x);";
    test.assertEquals(expected, content, "outputToFile should write script content to file");
});

// Test proper initialization of symbolBuilder
runner.addTest("Test symbolBuilder initialization", function(test) {
    test.assertTrue(btScript.symbolBuilder !== null, "symbolBuilder should be initialized");
    test.assertTrue(typeof btScript.symbolBuilder.buildValue === "function", 
        "symbolBuilder should have buildValue method");
    test.assertTrue(typeof btScript.symbolBuilder.encodeString === "function", 
        "symbolBuilder should have encodeString method");
});

// Run all tests
runner.runTests();
