#include '../lib/Functional.jsx';
#include './framework/TestFramework.jsx';

var runner = createTestRunner({
    logFileName: "FunctionalTests.log"
});

runner.addTest("foldLeft should sum an array of numbers", function(runner) {
    var result = foldLeft(0, [1, 2, 3, 4], function(acc, value) {
        return acc + value;
    });
    runner.assertEquals(10, result, "foldLeft did not sum correctly");
});

runner.addTest("foldLeft should handle an empty array", function(runner) {
    var result = foldLeft(0, [], function(acc, value) {
        return acc + value;
    });
    runner.assertEquals(0, result, "foldLeft did not handle empty array correctly");
});

runner.addTest("foldLeft should handle an array with one item", function(runner) {
    var result = foldLeft(0, [5], function(acc, value) {
        return acc + value;
    });
    runner.assertEquals(5, result, "foldLeft did not handle single-item array correctly");
});

runner.addTest("map should double each element in an array", function(runner) {
    var result = map([1, 2, 3], function(value) {
        return value * 2;
    });
    runner.assertEquals([2, 4, 6].toString(), result.toString(), "map did not double elements correctly");
});

runner.addTest("map should handle an empty array", function(runner) {
    var result = map([], function(value) {
        return value * 2;
    });
    runner.assertEquals([].toString(), result.toString(), "map did not handle empty array correctly");
});

runner.addTest("map should handle an array with one item", function(runner) {
    var result = map([3], function(value) {
        return value * 2;
    });
    runner.assertEquals([6].toString(), result.toString(), "map did not handle single-item array correctly");
});

runner.addTest("filter should return only even numbers", function(runner) {
    var result = filter([1, 2, 3, 4], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals([2, 4].toString(), result.toString(), "filter did not return even numbers correctly");
});

runner.addTest("filter should handle an empty array", function(runner) {
    var result = filter([], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals([].toString(), result.toString(), "filter did not handle empty array correctly");
});

runner.addTest("filter should handle an array with one item", function(runner) {
    var result = filter([4], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals([4].toString(), result.toString(), "filter did not handle single-item array correctly");
});

runner.addTest("first should return the first even number", function(runner) {
    var result = first([1, 3, 4, 6], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals(4, result, "first did not return the first even number");
});

runner.addTest("first should handle an empty array", function(runner) {
    var result = first([], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals(null, result, "first did not handle empty array correctly");
});

runner.addTest("first should handle an array with one item", function(runner) {
    var result = first([7], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals(null, result, "first did not handle single-item array correctly when no match");

    result = first([8], function(value) {
        return value % 2 === 0;
    });
    runner.assertEquals(8, result, "first did not handle single-item array correctly when match exists");
});

runner.addTest("each should iterate over all elements", function(runner) {
    var sum = 0;
    each([1, 2, 3], function(value) {
        sum += value;
    });
    runner.assertEquals(6, sum, "each did not iterate correctly");
});

runner.addTest("map_with_index should include indices in the transformation", function(runner) {
    var result = map_with_index(["a", "b", "c"], function(value, index) {
        return value + index;
    });
    runner.assertEquals(["a0", "b1", "c2"].toString(), result.toString(), "map_with_index did not include indices correctly");
});

runner.addTest("each_with_index should iterate with indices", function(runner) {
    var result = [];
    each_with_index(["x", "y", "z"], function(value, index) {
        result.push(value + index);
    });
    runner.assertEquals(["x0", "y1", "z2"].toString(), result.toString(), "each_with_index did not iterate with indices correctly");
});

runner.addTest("any should return true if any element satisfies the condition", function(runner) {
    var result = any([1, 2, 3, 4], function(value) {
        return value > 3;
    });
    runner.assertTrue(result, "any did not return true when one element satisfied the condition");
});

runner.addTest("any should return false if no element satisfies the condition", function(runner) {
    var result = any([1, 2, 3, 4], function(value) {
        return value > 10;
    });
    runner.assertFalse(result, "any did not return false when no element satisfied the condition");
});

runner.addTest("any should handle an empty array", function(runner) {
    var result = any([], function(value) {
        return value > 0;
    });
    runner.assertFalse(result, "any did not handle empty array correctly");
});

runner.addTest("any should handle an array with one item", function(runner) {
    var result = any([5], function(value) {
        return value > 0;
    });
    runner.assertTrue(result, "any did not handle single-item array correctly when condition is true");
    
    result = any([5], function(value) {
        return value > 10;
    });
    runner.assertFalse(result, "any did not handle single-item array correctly when condition is false");
});

runner.runTests();