export function serialize(data) {
  if (typeof(data) != 'object') {
    return '?' + data;
  }
  var str = [];
  for (var p in data) {
    if (data[p] && data.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
    }
  }
  return '?' + str.join('&');
}

export function getPathParam() {
  var args = arguments;
  var params = [];

  for (var a in args) {
    params.push(args[a]);
  }
  return params.join('/');
}

export function pluralize(str) {
  return str.slice(-1) === 'y' ? str.slice(0, -1) + 'ies' : str + 's';
}
