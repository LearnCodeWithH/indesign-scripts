function map(obj, func) {
  var result = [], index;
  for (index = 0, length = obj.length; index < length; index++) {
    result.push(func(obj[index]));
  }
  return result;
}

function each(obj, func) {
  var index;
  for (index = 0; index < obj.length; index++) {
    func.call(obj, obj[index]);
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