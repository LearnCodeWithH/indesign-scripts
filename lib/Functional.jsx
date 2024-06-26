//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

function foldLeft(initial, obj, func) {
  var index;
  var result = initial;
  for (index = 0, length = obj.length; index < length; index++) {
    result = func(result, obj[index]);
  }
  return result;
}

function map(obj, func) {
  var result = [], index;
  for (index = 0, length = obj.length; index < length; index++) {
    result.push(func(obj[index]));
  }
  return result;
}

function map_with_index(obj, func) {
  var result = [], index;
  for (index = 0, length = obj.length; index < length; index++) {
    result.push(func(obj[index], index));
  }
  return result;
}

function each(obj, func) {
  var index;
  for (index = 0; index < obj.length; index++) {
    func.call(obj, obj[index]);
  }
}

function each_with_index(obj, func) {
  var index;
  for (index = 0; index < obj.length; index++) {
    func.call(obj, obj[index], index);
  }
}

function filter(obj, func) {
  var result = [], index;
  for (index = 0, length = obj.length; index < length; index++) {
    if (func(obj[index])) {
      result.push(obj[index]);
    }
  }
  return result;
}

function first(obj, func) {
  var result = null, index;
  for (index = 0, length = obj.length; index < length; index++) {
    if (func(obj[index])) {
      result = obj[index], index;
      break;
    }
  }
  return result;
}