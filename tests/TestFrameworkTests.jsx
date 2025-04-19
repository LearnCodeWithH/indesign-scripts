/*
 * TestFramework Tests
 * 
 * This script tests the TestFramework.jsx functionality
 */

#target indesign
#include './framework/TestFramework.jsx'

// Main test runner - used to organize and run our tests
var runner = createTestRunner({
    logFileName: "TestFrameworkTests.log"
});

// Setup temporary test folder
var tempBasePath = new File($.fileName).parent + "/temp_test/";
var tempFolder = new Folder(tempBasePath);
if (!tempFolder.exists) {
    tempFolder.create();
}

// Helper function to create a test runner for tests
function createTempTestRunner(testName) {
    return createTestRunner({
        logFolderPath: tempBasePath,
        logFileName: "temp_" + testName.replace(/\s+/g, '_') + ".log"
    });
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

// Test basic assertions
runner.addTest("Test basic assertions", function(test) {
    // Create a dedicated test runner for this test
    var testRunner = createTempTestRunner("basic_assertions");

    // Test assertions with a fake test
    testRunner.currentTest = { name: "Mock Test" };
    
    // Test equality assertions
    test.assertTrue(testRunner.assertEquals(1, 1, "Equality assertion"), "assertEquals should pass for equal values");
    test.assertTrue(testRunner.assertNotEquals(1, 2, "Inequality assertion"), "assertNotEquals should pass for different values");
    
    // Test boolean assertions
    test.assertTrue(testRunner.assertTrue(true, "True assertion"), "assertTrue should pass for true");
    test.assertTrue(testRunner.assertFalse(false, "False assertion"), "assertFalse should pass for false");
    
    // Test null assertions
    test.assertTrue(testRunner.assertNull(null, "Null assertion"), "assertNull should pass for null");
    test.assertTrue(testRunner.assertNotNull("value", "Not null assertion"), "assertNotNull should pass for non-null");
    
    // Test array assertions
    test.assertTrue(testRunner.assertContains([1, 2, 3], 2, "Array contains assertion"), "assertContains should pass when item exists");
});

// Test assertion failures
runner.addTest("Test assertion failures handling", function(test) {
    // Create a dedicated test runner for this test
    var testRunner = createTempTestRunner("assertion_failures");
    
    // Test failing assertions with a fake test
    testRunner.currentTest = { name: "Mock Test" };
    
    // Set up the test runner
    testRunner.results.failures = [];
    testRunner.results.failed = 0;

    // Test failing assertions
    var result = testRunner.assertEquals("expected", "actual", "Should fail");
    
    // Verify the failure was recorded
    test.assertFalse(result, "Failed assertion should return false");
    test.assertEquals(1, testRunner.results.failed, "Failed assertion should increment failure count");
    test.assertEquals(1, testRunner.results.failures.length, "Failed assertion should add to failures array");
});

// Test exceptional conditions
runner.addTest("Test exception handling in assertions", function(test) {
    // Create a dedicated test runner for this test
    var testRunner = createTempTestRunner("exception_handling");
    
    // Set up the test runner for fake test
    testRunner.currentTest = { name: "Mock Test" };
    
    // Test assertThrows with an exception
    var result1 = testRunner.assertThrows(function() {
        throw new Error("Test error");
    }, Error, "Exception assertion");
    
    test.assertTrue(result1, "assertThrows should pass when exception is thrown");
    
    // Test assertThrows when no exception is thrown
    testRunner.results.failures = [];
    testRunner.results.failed = 0;
    
    var result2 = testRunner.assertThrows(function() {
        // No exception
    }, null, "Should fail");
    
    test.assertFalse(result2, "assertThrows should fail when no exception is thrown");
});

// Test logging folder creation
runner.addTest("Test log folder creation", function(test) {
    var tempFolderPath = tempBasePath + "nested_logs/";
    
    // Create a runner with custom log folder
    var testRunner = createTestRunner({
        logFolderPath: tempFolderPath,
        logFileName: "test_folder_creation.log"
    });
    
    // Force log creation
    testRunner.openLogFile();
    
    // Check if folder was created
    var folder = new Folder(tempFolderPath);
    test.assertTrue(folder.exists, "Log folder should be created");
    
    // Clean up
    testRunner.closeLogFile();
    // No individual file cleanup - relying on afterAll cleanup
});

// Test default filename generation
runner.addTest("Test default log filename generation", function(test) {
    var tempFolderPath = tempBasePath + "default_filename_logs/";
    
    // Create a runner with only folder specified
    var testRunner = createTestRunner({
        logFolderPath: tempFolderPath
        // No logFileName
    });
    
    // Force log creation
    testRunner.openLogFile();
    
    // Check if a file was created with the expected pattern
    var folder = new Folder(tempFolderPath);
    test.assertTrue(folder.exists, "Log folder should be created");
    
    // Check if logFileName was set
    test.assertNotNull(testRunner.logFileName, "Log file name should be generated");
    test.assertTrue(testRunner.logFileName.indexOf("TestResults_") === 0, "Default filename should start with 'TestResults_'");
    
    // Clean up
    testRunner.closeLogFile();
    // No individual file cleanup - relying on afterAll cleanup
});

// Run all tests - summary will be automatically output by the runner
runner.runTests();

// Set exit code based on test results
if (runner.results.failed > 0) {
    $.error = true;
}
