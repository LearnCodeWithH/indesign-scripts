#target indesign
#include './framework/TestFramework.jsx'
#include '../lib/bridgetalk/BridgeTalk.jsx'

// This test shows example functionality using TestFramework.jsx

// Create a test runner with file logging using the new options
var runner = createTestRunner({
    logFileName: "ExampleTests.log"
});

// Optional setup and teardown
runner.setBeforeAll(function() {
    // Setup code to run once before all tests
});

runner.setAfterAll(function() {
    // Cleanup code to run once after all tests
});

runner.setBeforeEach(function() {
    // Setup code to run before each test
});

runner.setAfterEach(function() {
    // Cleanup code to run after each test
});

// Add individual tests
runner.addTest("Test stringSymbol", function(test) {
    var result = stringSymbol("test");
    test.assertEquals("string", result.type_name, "stringSymbol should set correct type_name");
    test.assertEquals("test", result.value, "stringSymbol should set correct value");
});

runner.addTest("Test encodeValueRecursively with different types", function(test) {
    test.assertEquals("null", encodeValueRecursively(null), "null should encode to 'null'");
    test.assertEquals("\"test\"", encodeValueRecursively("test"), "string should be quoted");
    test.assertEquals("42", encodeValueRecursively(42), "number should be converted to string");
    test.assertTrue(true === true, "Basic assertion example");
});

// Add a skipped test (will be reported but not run)
runner.addSkippedTest("Test to be implemented later", function(test) {
    // This code won't run
});

// Run all tests with error handling
try {
    runner.runTests();
    
    // Show summary
    runner.output(runner.getSummary());
    
    // For command line execution, set error state if tests failed
    if (runner.results.failed > 0) {
        $.error = true;
    }
} catch (e) {
    $.writeln("ERROR: Test execution failed: " + e.message);
    $.error = true;
}
