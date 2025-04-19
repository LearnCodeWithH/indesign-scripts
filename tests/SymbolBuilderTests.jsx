/*
 * SymbolBuilder Tests
 * 
 * This script tests the encoding functions in SymbolBuilder.jsx
 * ExtendScript version: 4.5+ (InDesign CC and later)
 */

#target indesign
#include './framework/TestFramework.jsx';
#include '../lib/bridgetalk/SymbolBuilder.jsx';

// Create a test runner with file logging
var runner = createTestRunner({
    logFileName: "SymbolBuilderTests.log"
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

// Create a SymbolBuilder instance for testing
var symbolBuilder = createSymbolBuilder();

// Test encoding a string
runner.addTest("Test encodeString function", function(test) {
    test.assertEquals("\"test\"", symbolBuilder.encodeString("test"), "encodeString should add double quotes around a string");
    test.assertEquals("\"\"", symbolBuilder.encodeString(""), "encodeString should handle empty string");
    
    // Test with strings already containing quotes (should still add quotes)
    test.assertEquals("\"\\\"quoted\\\"\"", symbolBuilder.encodeString("\"quoted\""), "encodeString should handle strings with quotes");
});

// Test buildValue with different types
runner.addTest("Test buildValue with primitive types", function(test) {
    // Test null and undefined
    test.assertEquals("null", symbolBuilder.buildValue(null), "null should encode to 'null'");
    test.assertEquals("null", symbolBuilder.buildValue(undefined), "undefined should encode to 'null'");
    
    // Test strings
    test.assertEquals("\"hello\"", symbolBuilder.buildValue("hello"), "strings should be quoted");
    test.assertEquals("\"\"", symbolBuilder.buildValue(""), "empty string should be quoted");
    
    // Test numbers
    test.assertEquals("42", symbolBuilder.buildValue(42), "integers should convert to string");
    test.assertEquals("3.14", symbolBuilder.buildValue(3.14), "floats should convert to string");
    test.assertEquals("0", symbolBuilder.buildValue(0), "zero should convert to '0'");
    
    // Test booleans
    test.assertEquals("true", symbolBuilder.buildValue(true), "true should convert to 'true'");
    test.assertEquals("false", symbolBuilder.buildValue(false), "false should convert to 'false'");
});

// Test buildValue with arrays
runner.addTest("Test buildValue with arrays", function(test) {
    // Test empty array
    test.assertEquals("[]", symbolBuilder.buildValue([]), "empty array should encode to '[]'");
    
    // Test array with primitive values
    test.assertEquals("[1,2,3]", symbolBuilder.buildValue([1, 2, 3]), "array of numbers should encode correctly");
    test.assertEquals("[\"a\",\"b\",\"c\"]", symbolBuilder.buildValue(["a", "b", "c"]), "array of strings should encode correctly");
    
    // Test array with mixed values
    test.assertEquals("[1,\"string\",true]", symbolBuilder.buildValue([1, "string", true]), "array of mixed values should encode correctly");
    
    // Test nested arrays
    test.assertEquals("[[1,2],[3,4]]", symbolBuilder.buildValue([[1, 2], [3, 4]]), "nested arrays should encode correctly");
});

// Test buildValue with objects
runner.addTest("Test buildValue with objects", function(test) {
    // Test empty object
    test.assertEquals("{}", symbolBuilder.buildValue({}), "empty object should encode to '{}'");
    
    // Test simple object
    var simpleObj = { name: "John", age: 30 };
    var resultSimple = symbolBuilder.buildValue(simpleObj);
    
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
    
    var resultNested = symbolBuilder.buildValue(nestedObj);
    test.assertTrue(resultNested.indexOf("\"person\":") > -1, "Nested object should encode property name");
    test.assertTrue(resultNested.indexOf("\"name\": \"Jane\"") > -1, "Nested object should encode nested property name");
    test.assertTrue(resultNested.indexOf("\"active\": true") > -1, "Nested object should encode boolean property");
});

// Test encodeAnonymousHash
runner.addTest("Test encodeAnonymousHash function", function(test) {
    // Test with empty array of keys
    var emptyResult = symbolBuilder.encodeAnonymousHash({}, []);
    test.assertEquals("{}", emptyResult, "encodeAnonymousHash should produce empty hash for empty keys array");
    
    // Test with simple entries
    var obj = {
        name: "John",
        age: 30
    };
    var keys = ["name", "age"];
    var result = symbolBuilder.encodeAnonymousHash(obj, keys);
    
    // Check that the object value contains our key-value pairs
    test.assertTrue(result.indexOf("\"name\": \"John\"") > -1, "encodeAnonymousHash should include key 'name'");
    test.assertTrue(result.indexOf("\"age\": 30") > -1, "encodeAnonymousHash should include key 'age'");
    
    // Test with nested structures
    var nestedObj = {
        person: {name: "Jane", age: 25},
        active: true
    };
    var nestedKeys = ["person", "active"];
    var nestedResult = symbolBuilder.encodeAnonymousHash(nestedObj, nestedKeys);
    test.assertTrue(nestedResult.indexOf("\"person\":") > -1, "encodeAnonymousHash should handle nested objects properly");
    test.assertTrue(nestedResult.indexOf("\"active\": true") > -1, "encodeAnonymousHash should include boolean values");
});

// Test encodeArray
runner.addTest("Test encodeArray function", function(test) {
    // Test with empty array
    test.assertEquals("[]", symbolBuilder.encodeArray([]), "encodeArray should produce empty array brackets for empty input");
    
    // Test with array of simple values
    var simpleArray = [1, "test", true];
    var result = symbolBuilder.encodeArray(simpleArray);
    test.assertEquals("[1,\"test\",true]", result, "encodeArray should format array values correctly");
    
    // Test with nested arrays
    var nestedArray = [[1, 2], ["a", "b"]];
    var nestedResult = symbolBuilder.encodeArray(nestedArray);
    test.assertEquals("[[1,2],[\"a\",\"b\"]]", nestedResult, "encodeArray should handle nested arrays properly");
});

// Test encodeKeyValue
runner.addTest("Test encodeKeyValue function", function(test) {
    // Test with string value
    test.assertEquals("\"name\": \"John\"", symbolBuilder.encodeKeyValue("name", "John"), 
        "encodeKeyValue should format string value correctly");
    
    // Test with number value
    test.assertEquals("\"age\": 30", symbolBuilder.encodeKeyValue("age", 30), 
        "encodeKeyValue should format number value correctly");
    
    // Test with object value
    var personObj = { name: "Jane" };
    var result = symbolBuilder.encodeKeyValue("person", personObj);
    test.assertTrue(result.indexOf("\"person\": {") > -1, "encodeKeyValue should handle object values");
    test.assertTrue(result.indexOf("\"name\": \"Jane\"") > -1, "encodeKeyValue should encode nested properties");
});

// Test buildFunctionCall
runner.addTest("Test buildFunctionCall method", function(test) {
    // Test with no arguments
    var noArgsResult = symbolBuilder.buildFunctionCall("testFunc", function(sb) { return []; });
    test.assertEquals("testFunc();", noArgsResult, "Function call with no args should be formatted correctly");
    
    // Test with simple arguments
    var simpleResult = symbolBuilder.buildFunctionCall("testFunc", function(sb) { return [sb.buildValue("hello"), sb.buildValue(42)]; });
    test.assertEquals("testFunc(\"hello\",42);", simpleResult, "Function call with args should be formatted correctly");
    
    // Test with complex arguments
    var complexResult = symbolBuilder.buildFunctionCall("complexFunc", function(sb) {
        return [sb.buildValue("hello"), sb.buildValue({"name":"John","age":30})];
    });
    test.assertTrue(complexResult.indexOf("complexFunc(\"hello\",{") === 0, "Complex function call should start correctly");
    test.assertTrue(complexResult.indexOf("\"name\": \"John\"") > -1, "Complex function call should encode hash properties");
});

// Test buildVariableAssign
runner.addTest("Test buildVariableAssign method", function(test) {
    // Test with empty object
    var emptyResult = symbolBuilder.buildVariableAssign("emptyVar", function(sb) { return sb.buildValue({}); });
    test.assertEquals("var emptyVar = {};", emptyResult, "Variable with empty hash should be formatted correctly");
    
    // Test with object
    var objResult = symbolBuilder.buildVariableAssign("testVar", function(sb) {
        return sb.buildValue({"name":"John","age":30});
    });
    test.assertTrue(objResult.indexOf("var testVar = {") === 0, "Variable hash should start with correct declaration");
    test.assertTrue(objResult.indexOf("\"name\": \"John\"") > -1, "Variable hash should contain key 'name'");
    test.assertTrue(objResult.indexOf("\"age\": 30") > -1, "Variable hash should contain numeric value");
});

// Test projectObjectByKeys
runner.addTest("Test projectObjectByKeys function", function(test) {
    // Create a test object
    var obj = {
        name: "John",
        age: 30,
        active: true
    };
    
    // Extract specific fields
    var keys = ["name", "age"];
    var result = symbolBuilder.projectObjectByKeys(obj, keys, true);
    
    // Test the structure
    test.assertEquals("John", result.name, "Result should contain 'name' property");
    test.assertEquals(30, result.age, "Result should contain 'age' property");
    test.assertEquals(undefined, result.active, "Result should not contain 'active' property");
    
    // Test with missing field but non-strict
    var missingResult = symbolBuilder.projectObjectByKeys(obj, ["name", "email"], false);
    test.assertEquals("John", missingResult.name, "Result should contain 'name' property");
    test.assertEquals(null, missingResult.email, "Result should contain 'email' property with null value");
});

// Run all tests
runner.runTests();
