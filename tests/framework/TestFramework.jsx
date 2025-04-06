/*
 * TestFramework.jsx
 * A lightweight testing framework for Adobe ExtendScript
 * 
 * This framework provides test assertions and result gathering
 * specifically designed for ExtendScript in InDesign.
 */

// Include datetime functions for log file naming
#include '../../lib/Datetime.jsx'

// Main module function using the ExtendScript-compatible pattern
function createTestFramework() {
    var VERSION = 1.0;
    
    function TestFrameworkClass() {
        var testFramework = this;
        
        // Framework version
        testFramework.version = VERSION;
        testFramework.description = "A lightweight testing framework for ExtendScript";
        
        /**
         * Creates a new TestRunner
         */
        testFramework.createTestRunner = function(options) {
            return new TestRunnerClass(options || {});
        };
        
        /**
         * TestRunner - Class to manage test execution and results
         */
        function TestRunnerClass(options) {
            var runner = this;
            
            // Configuration with defaults
            runner.options = options;
            
            // File logging configuration
            runner.logFile = null;
            runner.logFolderPath = runner.options.logFolderPath || new File($.fileName).parent.parent + "/logs/";
            runner.logFileName = runner.options.logFileName || null; // Will be generated in openLogFile if null
                
            // Test results storage
            runner.results = {
                passed: 0,
                failed: 0,
                skipped: 0,
                failures: [],
                testCount: 0,
                startTime: null,
                endTime: null
            };
            
            // Optional setup and teardown functions
            runner.beforeAll = null;
            runner.afterAll = null;
            runner.beforeEach = null;
            runner.afterEach = null;
            
            // Collection of test cases
            runner.testCases = [];
            
            // Current test being executed
            runner.currentTest = null;
            
            /**
             * Creates a directory if it doesn't exist
             */
            runner.createFolderIfNeeded = function(folderPath) {
                var folder = new Folder(folderPath);
                if (!folder.exists) {
                    try {
                        if (!folder.create()) {
                            $.writeln("ERROR: Failed to create folder: " + folderPath);
                            return false;
                        }
                    } catch (e) {
                        $.writeln("ERROR: Failed to create folder: " + e.message);
                        return false;
                    }
                }
                return true;
            };
            
            /**
             * Opens the log file if a path is configured
             */
            runner.openLogFile = function() {
                if (!runner.logFolderPath) return;
                
                try {
                    // Create the log directory if it doesn't exist
                    if (!runner.createFolderIfNeeded(runner.logFolderPath)) {
                        return;
                    }
                    
                    // Generate default filename with datetime if none provided
                    if (!runner.logFileName) {
                        var now = new Date();
                        runner.logFileName = "TestResults_" + datetimeString(now) + ".log";
                    }
                    
                    var fullPath = runner.logFolderPath + runner.logFileName;
                    
                    // Create the file if it doesn't exist, overwrite if it does
                    runner.logFile = new File(fullPath);
                    runner.logFile.encoding = "UTF-8";
                    runner.logFile.open("w");
                    runner.writeToLogFile("=== Test Session Started: " + new Date().toString() + " ===\n");
                } catch (e) {
                    $.writeln("ERROR: Failed to open log file: " + e.message);
                    runner.logFile = null;
                }
            };
            
            /**
             * Closes the log file if it's open
             */
            runner.closeLogFile = function() {
                if (runner.logFile && runner.logFile.exists) {
                    try {
                        runner.writeToLogFile("\n=== Test Session Ended: " + new Date().toString() + " ===");
                        runner.logFile.close();
                    } catch (e) {
                        $.writeln("ERROR: Failed to close log file: " + e.message);
                    }
                    runner.logFile = null;
                }
            };
            
            /**
             * Write to the log file if it's open
             */
            runner.writeToLogFile = function(message) {
                if (runner.logFile && runner.logFile.exists) {
                    try {
                        runner.logFile.writeln(message);
                    } catch (e) {
                        $.writeln("ERROR: Failed to write to log file: " + e.message);
                    }
                }
            };
            
            /**
             * Sets up a function to run before all tests
             */
            runner.setBeforeAll = function(fn) {
                runner.beforeAll = fn;
            };
            
            /**
             * Sets up a function to run after all tests
             */
            runner.setAfterAll = function(fn) {
                runner.afterAll = fn;
            };
            
            /**
             * Sets up a function to run before each test
             */
            runner.setBeforeEach = function(fn) {
                runner.beforeEach = fn;
            };
            
            /**
             * Sets up a function to run after each test
             */
            runner.setAfterEach = function(fn) {
                runner.afterEach = fn;
            };
            
            /**
             * Adds a test case
             */
            runner.addTest = function(name, testFn) {
                runner.testCases.push({
                    name: name,
                    testFn: testFn,
                    skip: false
                });
            };
            
            /**
             * Adds a test case that will be skipped
             */
            runner.addSkippedTest = function(name, testFn) {
                runner.testCases.push({
                    name: name,
                    testFn: testFn,
                    skip: true
                });
            };
            
            /**
             * Runs all test cases
             */
            runner.runTests = function() {
                runner.results.startTime = new Date();
                
                // Open log file before running tests
                runner.openLogFile();
                
                try {
                    // Run before all setup if defined
                    if (typeof runner.beforeAll === 'function') {
                        try {
                            runner.beforeAll();
                        } catch (e) {
                            runner.output("ERROR in beforeAll: " + e.message);
                            runner.closeLogFile();
                            return runner.results;
                        }
                    }
                    
                    // Run each test case
                    for (var i = 0; i < runner.testCases.length; i++) {
                        var testCase = runner.testCases[i];
                        runner.results.testCount++;
                        
                        if (testCase.skip) {
                            runner.results.skipped++;
                            runner.output("SKIPPED: " + testCase.name);
                            continue;
                        }
                        
                        runner.output("RUNNING: " + testCase.name);
                        runner.currentTest = testCase;
                        
                        try {
                            // Run before each if defined
                            if (typeof runner.beforeEach === 'function') {
                                runner.beforeEach();
                            }
                            
                            // Run the actual test
                            testCase.testFn(runner);
                            
                            // Run after each if defined
                            if (typeof runner.afterEach === 'function') {
                                runner.afterEach();
                            }
                        } catch (e) {
                            runner.fail("Exception thrown: " + e.message + "\n" + e.stack);
                        }
                        
                        runner.currentTest = null;
                    }
                    
                    // Run after all teardown if defined
                    if (typeof runner.afterAll === 'function') {
                        try {
                            runner.afterAll();
                        } catch (e) {
                            runner.output("ERROR in afterAll: " + e.message);
                        }
                    }
                    
                    runner.results.endTime = new Date();
                } catch (e) {
                    runner.output("CRITICAL ERROR: " + e.message + "\n" + e.stack);
                } finally {
                    // Output test summary before closing the log file
                    runner.output("\n" + runner.getSummary());
                    
                    // Always close the log file
                    runner.closeLogFile();
                }
                return runner.results;
            };
            
            /**
             * Get summary of test results
             */
            runner.getSummary = function() {
                var duration = runner.results.endTime - runner.results.startTime;
                var summary = "Test Results:\n" +
                              "Total: " + runner.results.testCount + "\n" +
                              "Passed: " + runner.results.passed + "\n" +
                              "Failed: " + runner.results.failed + "\n" +
                              "Skipped: " + runner.results.skipped + "\n" +
                              "Duration: " + (duration / 1000).toFixed(2) + "s" +
                              (runner.results.failures.length > 0 ? "\n\nFailures:\n" + runner.results.failures.join("\n\n") : "");
                
                return summary;
            };
            
            /**
             * Output a message based on mode (command line or interactive)
             */
            runner.output = function(message) {
                // Just log to ExtendScript console in interactive mode
                $.writeln(message);
                
                // Write to log file if configured
                runner.writeToLogFile(message);
            };
            
            /**
             * Report a test failure
             */
            runner.fail = function(message) {
                if (!runner.currentTest) {
                    throw new Error("fail() called outside of a test");
                }
                
                runner.results.failed++;
                var failureMessage = "FAILED: " + runner.currentTest.name + " - " + message;
                runner.results.failures.push(failureMessage);
                runner.output(failureMessage);
                
                return false;
            };
            
            /**
             * Report a test pass
             */
            runner.pass = function() {
                if (!runner.currentTest) {
                    throw new Error("pass() called outside of a test");
                }
                
                runner.results.passed++;
                return true;
            };
            
            /* 
             * Assertion functions
             */
            
            /**
             * Assert that two values are equal
             */
            runner.assertEquals = function(expected, actual, message) {
                message = message || "Expected equality";
                if (expected === actual) {
                    return runner.pass();
                } else {
                    return runner.fail(message + "\nExpected: " + expected + "\nActual: " + actual);
                }
            };
            
            /**
             * Assert that two values are not equal
             */
            runner.assertNotEquals = function(expected, actual, message) {
                message = message || "Expected inequality";
                if (expected !== actual) {
                    return runner.pass();
                } else {
                    return runner.fail(message + "\nExpected values to differ from: " + expected);
                }
            };
            
            /**
             * Assert that a value is true
             */
            runner.assertTrue = function(actual, message) {
                message = message || "Expected true value";
                return runner.assertEquals(true, actual, message);
            };
            
            /**
             * Assert that a value is false
             */
            runner.assertFalse = function(actual, message) {
                message = message || "Expected false value";
                return runner.assertEquals(false, actual, message);
            };
            
            /**
             * Assert that a value is not null or undefined
             */
            runner.assertNotNull = function(actual, message) {
                message = message || "Expected non-null value";
                if (actual !== null && actual !== undefined) {
                    return runner.pass();
                } else {
                    return runner.fail(message + "\nActual: " + actual);
                }
            };
            
            /**
             * Assert that a value is null or undefined
             */
            runner.assertNull = function(actual, message) {
                message = message || "Expected null value";
                if (actual === null || actual === undefined) {
                    return runner.pass();
                } else {
                    return runner.fail(message + "\nActual: " + actual);
                }
            };
            
            /**
             * Assert that an array contains an item
             */
            runner.assertContains = function(array, item, message) {
                message = message || "Expected array to contain item";
                
                if (!(array instanceof Array)) {
                    return runner.fail("assertContains requires an array as first argument");
                }
                
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === item) {
                        return runner.pass();
                    }
                }
                
                return runner.fail(message + "\nItem: " + item + "\nArray: " + array.toString());
            };
            
            /**
             * Assert that a function throws an exception
             */
            runner.assertThrows = function(fn, expectedErrorType, message) {
                message = message || "Expected function to throw";
                
                if (typeof fn !== 'function') {
                    return runner.fail("assertThrows requires a function as first argument");
                }
                
                try {
                    fn();
                    return runner.fail(message + "\nNo exception was thrown");
                } catch (e) {
                    if (expectedErrorType && !(e instanceof expectedErrorType)) {
                        return runner.fail(message + "\nExpected: " + expectedErrorType + "\nActual: " + e.constructor.name);
                    }
                    return runner.pass();
                }
            };
        }
    }
    
    // Return a new instance of the framework
    return new TestFrameworkClass();
}

// Create a global instance of the framework
var testFramework = createTestFramework();

// Export the createTestRunner function to maintain backward compatibility
function createTestRunner(options) {
    return testFramework.createTestRunner(options);
}