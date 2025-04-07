/*
 * BridgeTalk Encoding Tests
 * 
 * This script tests the encoding functions in BridgeTalk.jsx
 * ExtendScript version: 4.5+ (InDesign CC and later)
 */

#target indesign
#include './framework/TestFramework.jsx';
#include '../lib/File.jsx';
#include '../lib/bridgetalk/BridgeTalk.jsx';
#include '../lib/Functional.jsx';

// Create a test runner with file logging
var runner = createTestRunner({
    logFileName: "BridgeTalkTests.log"
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
        $.writeln("WARNING: Could not remove temp folder: " + e.message);
    }
});

// Test string symbol creation
runner.addTest("Test stringSymbol function", function(test) {
    var result = stringSymbol("hello");
    test.assertEquals("string", result.type_name, "stringSymbol should set type_name to 'string'");
    test.assertEquals("hello", result.value, "stringSymbol should preserve the string value");
    
    // Test with empty string
    var emptyResult = stringSymbol("");
    test.assertEquals("string", emptyResult.type_name, "stringSymbol should set type_name to 'string' for empty string");
    test.assertEquals("", emptyResult.value, "stringSymbol should preserve empty string value");
    
    // Test with special characters
    var specialResult = stringSymbol("special: \n\"quote\"");
    test.assertEquals("special: \n\"quote\"", specialResult.value, "stringSymbol should preserve special characters");
});

// Test quoting a string
runner.addTest("Test quoteString function", function(test) {
    test.assertEquals("\"test\"", quoteString("test"), "quoteString should add double quotes around a string");
    test.assertEquals("\"\"", quoteString(""), "quoteString should handle empty string");
    
    // Test with strings already containing quotes (should still add quotes)
    test.assertEquals("\"\\\"quoted\\\"\"", quoteString("\"quoted\""), "quoteString should handle strings with quotes");
});

// Test encodeValueRecursively with different types
runner.addTest("Test encodeValueRecursively with primitive types", function(test) {
    // Test null and undefined
    test.assertEquals("null", encodeValueRecursively(null), "null should encode to 'null'");
    test.assertEquals("null", encodeValueRecursively(undefined), "undefined should encode to 'null'");
    
    // Test strings
    test.assertEquals("\"hello\"", encodeValueRecursively("hello"), "strings should be quoted");
    test.assertEquals("\"\"", encodeValueRecursively(""), "empty string should be quoted");
    
    // Test numbers
    test.assertEquals("42", encodeValueRecursively(42), "integers should convert to string");
    test.assertEquals("3.14", encodeValueRecursively(3.14), "floats should convert to string");
    test.assertEquals("0", encodeValueRecursively(0), "zero should convert to '0'");
    
    // Test booleans
    test.assertEquals("true", encodeValueRecursively(true), "true should convert to 'true'");
    test.assertEquals("false", encodeValueRecursively(false), "false should convert to 'false'");
});

// Test encodeValueRecursively with arrays
runner.addTest("Test encodeValueRecursively with arrays", function(test) {
    // Test empty array
    test.assertEquals("[]", encodeValueRecursively([]), "empty array should encode to '[]'");
    
    // Test array with primitive values
    test.assertEquals("[1,2,3]", encodeValueRecursively([1, 2, 3]), "array of numbers should encode correctly");
    test.assertEquals("[\"a\",\"b\",\"c\"]", encodeValueRecursively(["a", "b", "c"]), "array of strings should encode correctly");
    
    // Test array with mixed values
    test.assertEquals("[1,\"string\",true]", encodeValueRecursively([1, "string", true]), "array of mixed values should encode correctly");
    
    // Test nested arrays
    test.assertEquals("[[1,2],[3,4]]", encodeValueRecursively([[1, 2], [3, 4]]), "nested arrays should encode correctly");
});

// Test encodeValueRecursively with objects
runner.addTest("Test encodeValueRecursively with objects", function(test) {
    // Test empty object
    test.assertEquals("{}", encodeValueRecursively({}), "empty object should encode to '{}'");
    
    // Test simple object
    var simpleObj = { name: "John", age: 30 };
    var expectedSimple = "{\"name\": \"John\",\"age\": 30}";
    var resultSimple = encodeValueRecursively(simpleObj);
    
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
    
    var resultNested = encodeValueRecursively(nestedObj);
    test.assertTrue(resultNested.indexOf("\"person\":") > -1, "Nested object should encode property name");
    test.assertTrue(resultNested.indexOf("\"name\": \"Jane\"") > -1, "Nested object should encode nested property name");
    test.assertTrue(resultNested.indexOf("\"active\": true") > -1, "Nested object should encode boolean property");
});

// Test anonymousHashSymbol
runner.addTest("Test anonymousHashSymbol function", function(test) {
    // Test with empty array
    var emptyResult = anonymousHashSymbol([]);
    test.assertEquals("hashmap", emptyResult.type_name, "anonymousHashSymbol should set type_name to 'hashmap'");
    test.assertEquals("{}", emptyResult.value, "anonymousHashSymbol should produce empty hash for empty array");
    
    // Test with simple entries
    var entries = [
        ["name", "John"],
        ["age", 30]
    ];
    var result = anonymousHashSymbol(entries);
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
    var nestedResult = anonymousHashSymbol(nestedEntries);
    test.assertEquals("hashmap", nestedResult.type_name, "anonymousHashSymbol should set correct type_name for nested entries");
    test.assertTrue(nestedResult.value.indexOf("\"person\":") > -1, "anonymousHashSymbol should handle nested objects properly");
});

// Test anonymousHashArraySymbol
runner.addTest("Test anonymousHashArraySymbol function", function(test) {
    // Test with empty array
    var emptyResult = anonymousHashArraySymbol([]);
    test.assertEquals("array", emptyResult.type_name, "anonymousHashArraySymbol should set type_name to 'array'");
    test.assertEquals("[]", emptyResult.value, "anonymousHashArraySymbol should produce empty array for empty input");
    
    // Test with array of simple objects
    var objArray = [
        {name: "John", age: 30},
        {name: "Jane", age: 25}
    ];
    
    var result = anonymousHashArraySymbol(objArray);
    test.assertEquals("array", result.type_name, "anonymousHashArraySymbol should set correct type_name");
    
    // Check that the value looks like an array of objects
    test.assertTrue(result.value.indexOf("[{") === 0, "Result should start with '[{'");
    test.assertTrue(result.value.indexOf("\"name\"") > -1, "Result should contain 'name' key");
    test.assertTrue(result.value.indexOf("\"John\"") > -1, "Result should contain 'John' value");
    test.assertTrue(result.value.indexOf("\"Jane\"") > -1, "Result should contain 'Jane' value");
});

// Test buildFunctionCallForScript
runner.addTest("Test buildFunctionCallForScript function", function(test) {
    // Test with no arguments
    var noArgsResult = buildFunctionCallForScript("testFunc", []);
    test.assertEquals("testFunc();", noArgsResult, "Function call with no args should be formatted correctly");
    
    // Test with simple arguments
    var simpleArgs = [
        stringSymbol("hello"),
        {type_name: "number", value: 42}
    ];
    var simpleResult = buildFunctionCallForScript("testFunc", simpleArgs);
    test.assertEquals("testFunc(\"hello\",42);", simpleResult, "Function call with args should be formatted correctly");
    
    // Test with complex arguments
    var hashArg = anonymousHashSymbol([["name", "John"], ["age", 30]]);
    var complexArgs = [stringSymbol("hello"), hashArg];
    var complexResult = buildFunctionCallForScript("complexFunc", complexArgs);
    test.assertTrue(complexResult.indexOf("complexFunc(\"hello\",{") === 0, "Complex function call should start correctly");
    test.assertTrue(complexResult.indexOf("\"name\"") > -1, "Complex function call should encode hash properties");
});

// Test buildVariableHashForScript
runner.addTest("Test buildVariableHashForScript function", function(test) {
    // Test with empty hash
    var emptyResult = buildVariableHashForScript("emptyVar", []);
    test.assertEquals("var emptyVar = {}", emptyResult, "Variable with empty hash should be formatted correctly");
    
    // Test with simple entries
    var entries = [
        ["name", "John"],
        ["age", 30]
    ];
    var result = buildVariableHashForScript("testVar", entries);
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
    var result = hashEntriesArrayByField(obj, ["name", "age"]);
    
    // Test the structure
    test.assertEquals(2, result.length, "Should return array with specified number of entries");
    test.assertEquals("name", result[0][0], "First entry key should be 'name'");
    test.assertEquals("John", result[0][1], "First entry value should be 'John'");
    test.assertEquals("age", result[1][0], "Second entry key should be 'age'");
    test.assertEquals(30, result[1][1], "Second entry value should be 30");
    
    // Test with missing field
    var missingResult = hashEntriesArrayByField(obj, ["name", "email"]);
    test.assertEquals(2, missingResult.length, "Should return array with specified number of entries");
    test.assertEquals("name", missingResult[0][0], "First entry key should be 'name'");
    test.assertEquals("email", missingResult[1][0], "Second entry key should be 'email'");
    test.assertEquals(undefined, missingResult[1][1], "Value for missing field should be undefined");
});

// Test stitchScripts
runner.addTest("Test stitchScripts function", function(test) {
    // Test with empty array
    test.assertEquals("", stitchScripts([]), "stitchScripts with empty array should return empty string");
    
    // Test with single script
    test.assertEquals("var x = 1;", stitchScripts(["var x = 1;"]), "stitchScripts with single script should return that script");
    
    // Test with multiple scripts
    var scripts = [
        "var x = 1;",
        "var y = 2;",
        "alert(x + y);"
    ];
    var expected = "var x = 1;\rvar y = 2;\ralert(x + y);";
    test.assertEquals(expected, stitchScripts(scripts), "stitchScripts should join scripts with CR separator");
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
    var fileContent = readFileForScript(tempFilePath);
    test.assertEquals("var testVar = 'Hello World';", fileContent, "readFileForScript should correctly read file content");
});

// Run all tests
runner.runTests();
