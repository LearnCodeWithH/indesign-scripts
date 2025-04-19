/*
 * BridgeTalk Encoding Tests
 * 
 * This script tests the encoding functions in BridgeTalkScript.jsx
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

// Test string symbol creation
runner.addTest("Test stringSymbol function", function(test) {
    var result = btScript.stringSymbol("hello");
    test.assertEquals("string", result.type_name, "stringSymbol should set type_name to 'string'");
    test.assertEquals("hello", result.value, "stringSymbol should preserve the string value");
    
    // Test with empty string
    var emptyResult = btScript.stringSymbol("");
    test.assertEquals("string", emptyResult.type_name, "stringSymbol should set type_name to 'string' for empty string");
    test.assertEquals("", emptyResult.value, "stringSymbol should preserve empty string value");
    
    // Test with special characters
    var specialResult = btScript.stringSymbol("special: \n\"quote\"");
    test.assertEquals("special: \n\"quote\"", specialResult.value, "stringSymbol should preserve special characters");
});

// Test quoting a string
runner.addTest("Test quoteString function", function(test) {
    test.assertEquals("\"test\"", btScript.quoteString("test"), "quoteString should add double quotes around a string");
    test.assertEquals("\"\"", btScript.quoteString(""), "quoteString should handle empty string");
    
    // Test with strings already containing quotes (should still add quotes)
    test.assertEquals("\"\\\"quoted\\\"\"", btScript.quoteString("\"quoted\""), "quoteString should handle strings with quotes");
});

// Test encodeValueRecursively with different types
runner.addTest("Test encodeValueRecursively with primitive types", function(test) {
    // Test null and undefined
    test.assertEquals("null", btScript.encodeValueRecursively(null), "null should encode to 'null'");
    test.assertEquals("null", btScript.encodeValueRecursively(undefined), "undefined should encode to 'null'");
    
    // Test strings
    test.assertEquals("\"hello\"", btScript.encodeValueRecursively("hello"), "strings should be quoted");
    test.assertEquals("\"\"", btScript.encodeValueRecursively(""), "empty string should be quoted");
    
    // Test numbers
    test.assertEquals("42", btScript.encodeValueRecursively(42), "integers should convert to string");
    test.assertEquals("3.14", btScript.encodeValueRecursively(3.14), "floats should convert to string");
    test.assertEquals("0", btScript.encodeValueRecursively(0), "zero should convert to '0'");
    
    // Test booleans
    test.assertEquals("true", btScript.encodeValueRecursively(true), "true should convert to 'true'");
    test.assertEquals("false", btScript.encodeValueRecursively(false), "false should convert to 'false'");
});

// Test encodeValueRecursively with arrays
runner.addTest("Test encodeValueRecursively with arrays", function(test) {
    // Test empty array
    test.assertEquals("[]", btScript.encodeValueRecursively([]), "empty array should encode to '[]'");
    
    // Test array with primitive values
    test.assertEquals("[1,2,3]", btScript.encodeValueRecursively([1, 2, 3]), "array of numbers should encode correctly");
    test.assertEquals("[\"a\",\"b\",\"c\"]", btScript.encodeValueRecursively(["a", "b", "c"]), "array of strings should encode correctly");
    
    // Test array with mixed values
    test.assertEquals("[1,\"string\",true]", btScript.encodeValueRecursively([1, "string", true]), "array of mixed values should encode correctly");
    
    // Test nested arrays
    test.assertEquals("[[1,2],[3,4]]", btScript.encodeValueRecursively([[1, 2], [3, 4]]), "nested arrays should encode correctly");
});

// Test encodeValueRecursively with objects
runner.addTest("Test encodeValueRecursively with objects", function(test) {
    // Test empty object
    test.assertEquals("{}", btScript.encodeValueRecursively({}), "empty object should encode to '{}'");
    
    // Test simple object
    var simpleObj = { name: "John", age: 30 };
    var resultSimple = btScript.encodeValueRecursively(simpleObj);
    
    test.assertTrue(resultSimple.indexOf("\"name\": \"John\"") > -1, "Object should encode property name correctly");
    test.assertTrue(resultSimple.indexOf("\"age\": 30") > -1, "Object should encode property age correctly");
    
    // Test nested object
    var nestedObj = { 
        person: { 
            name: "Jane", 
            age: 25 
        },
        active: true 
    };
    
    var resultNested = btScript.encodeValueRecursively(nestedObj);
    test.assertTrue(resultNested.indexOf("\"person\":") > -1, "Nested object should encode property name");
    test.assertTrue(resultNested.indexOf("\"name\": \"Jane\"") > -1, "Nested object should encode nested property name");
    test.assertTrue(resultNested.indexOf("\"active\": true") > -1, "Nested object should encode boolean property");
});

// Test anonymousHashSymbol
runner.addTest("Test anonymousHashSymbol function", function(test) {
    // Test with empty array
    var emptyResult = btScript.anonymousHashSymbol([]);
    test.assertEquals("hashmap", emptyResult.type_name, "anonymousHashSymbol should set type_name to 'hashmap'");
    test.assertEquals("{}", emptyResult.value, "anonymousHashSymbol should produce empty hash for empty array");
    
    // Test with simple entries
    var entries = [
        ["name", "John"],
        ["age", 30]
    ];
    var result = btScript.anonymousHashSymbol(entries);
    test.assertEquals("hashmap", result.type_name, "anonymousHashSymbol should set correct type_name");
    
    // Check that the object value contains our key-value pairs
    test.assertTrue(result.value.indexOf("\"name\":") > -1, "anonymousHashSymbol should include key 'name'");
    test.assertTrue(result.value.indexOf("\"John\"") > -1, "anonymousHashSymbol should include value 'John'");
    test.assertTrue(result.value.indexOf("\"age\":") > -1, "anonymousHashSymbol should include key 'age'");
    test.assertTrue(result.value.indexOf("30") > -1, "anonymousHashSymbol should include value 30");
    
    // Test with nested structures
    var nestedEntries = [
        ["person", {name: "Jane", age: 25}],
        ["active", true]
    ];
    var nestedResult = btScript.anonymousHashSymbol(nestedEntries);
    test.assertEquals("hashmap", nestedResult.type_name, "anonymousHashSymbol should set correct type_name for nested entries");
    test.assertTrue(nestedResult.value.indexOf("\"person\":") > -1, "anonymousHashSymbol should handle nested objects properly");
});

// Test anonymousHashArraySymbol
runner.addTest("Test anonymousHashArraySymbol function", function(test) {
    // Test with empty array
    var emptyResult = btScript.anonymousHashArraySymbol([]);
    test.assertEquals("array", emptyResult.type_name, "anonymousHashArraySymbol should set type_name to 'array'");
    test.assertEquals("[]", emptyResult.value, "anonymousHashArraySymbol should produce empty array for empty input");
    
    // Test with array of simple objects
    var objArray = [
        {name: "John", age: 30},
        {name: "Jane", age: 25}
    ];
    
    var result = btScript.anonymousHashArraySymbol(objArray);
    test.assertEquals("array", result.type_name, "anonymousHashArraySymbol should set correct type_name");
    
    // Check that the value looks like an array of objects
    test.assertTrue(result.value.indexOf("[{") === 0, "Result should start with '[{'");
    test.assertTrue(result.value.indexOf("\"name\"") > -1, "Result should contain 'name' key");
    test.assertTrue(result.value.indexOf("\"John\"") > -1, "Result should contain 'John' value");
    test.assertTrue(result.value.indexOf("\"Jane\"") > -1, "Result should contain 'Jane' value");
});

// Test buildFunctionCall
runner.addTest("Test buildFunctionCall method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Test with no arguments
    btScript.buildFunctionCall("testFunc", []);
    test.assertEquals("testFunc();", btScript.scriptParts[0], "Function call with no args should be formatted correctly");
    
    // Reset script parts
    btScript.scriptParts = [];
    
    // Test with simple arguments
    var simpleArgs = [
        btScript.stringSymbol("hello"),
        {type_name: "number", value: 42}
    ];
    btScript.buildFunctionCall("testFunc", simpleArgs);
    test.assertEquals("testFunc(\"hello\",42);", btScript.scriptParts[0], "Function call with args should be formatted correctly");
    
    // Reset script parts
    btScript.scriptParts = [];
    
    // Test with complex arguments
    var hashArg = btScript.anonymousHashSymbol([["name", "John"], ["age", 30]]);
    var complexArgs = [btScript.stringSymbol("hello"), hashArg];
    btScript.buildFunctionCall("complexFunc", complexArgs);
    var complexResult = btScript.scriptParts[0];
    test.assertTrue(complexResult.indexOf("complexFunc(\"hello\",{") === 0, "Complex function call should start correctly");
    test.assertTrue(complexResult.indexOf("\"name\"") > -1, "Complex function call should encode hash properties");
});

// Test buildVariableHash
runner.addTest("Test buildVariableHash method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Test with empty hash
    btScript.buildVariableHash("emptyVar", []);
    test.assertEquals("var emptyVar = {};", btScript.scriptParts[0], "Variable with empty hash should be formatted correctly");
    
    // Reset script parts
    btScript.scriptParts = [];
    
    // Test with simple entries
    var entries = [
        ["name", "John"],
        ["age", 30]
    ];
    btScript.buildVariableHash("testVar", entries);
    var result = btScript.scriptParts[0];
    test.assertTrue(result.indexOf("var testVar = {") === 0, "Variable hash should start with correct declaration");
    test.assertTrue(result.indexOf("\"name\"") > -1, "Variable hash should contain key 'name'");
    test.assertTrue(result.indexOf("\"John\"") > -1, "Variable hash should contain value 'John'");
});

// Test hashEntriesArrayByField
runner.addTest("Test hashEntriesArrayByField function", function(test) {
    // Create a test object
    var obj = {
        name: "John",
        age: 30,
        active: true
    };
    
    // Extract specific fields
    var result = btScript.hashEntriesArrayByField(obj, ["name", "age"]);
    
    // Test the structure
    test.assertEquals(2, result.length, "Should return array with specified number of entries");
    test.assertEquals("name", result[0][0], "First entry key should be 'name'");
    test.assertEquals("John", result[0][1], "First entry value should be 'John'");
    test.assertEquals("age", result[1][0], "Second entry key should be 'age'");
    test.assertEquals(30, result[1][1], "Second entry value should be 30");
    
    // Test with missing field
    var missingResult = btScript.hashEntriesArrayByField(obj, ["name", "email"]);
    test.assertEquals(2, missingResult.length, "Should return array with specified number of entries");
    test.assertEquals("name", missingResult[0][0], "First entry key should be 'name'");
    test.assertEquals("email", missingResult[1][0], "Second entry key should be 'email'");
    test.assertEquals(undefined, missingResult[1][1], "Value for missing field should be undefined");
});

// Test script generation
runner.addTest("Test getScript method", function(test) {
    // Clear previous script parts
    btScript.scriptParts = [];
    
    // Add multiple script parts
    btScript.addScript("var x = 1;");
    btScript.addScript("var y = 2;");
    btScript.addScript("alert(x + y);");
    
    // Test the combined script
    var expected = "var x = 1;\rvar y = 2;\ralert(x + y);";
    test.assertEquals(expected, btScript.getScript(), "getScript should join script parts with CR separator");
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
    test.assertEquals(expected.length, content.length, "outputToFile should write script content length to file");
    test.assertEquals(expected, content, "outputToFile should write script content to file");
});

// Run all tests
runner.runTests();
