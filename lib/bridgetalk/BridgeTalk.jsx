// Helper functions to more easily render BridgeTalk calls

function buildFunctionCall(func_name, args_array) {
    var function_left = func_name + "("
    var function_right = ");"
    var args_block = args_array.join(',');
    return function_left + args_block + function_right;
}