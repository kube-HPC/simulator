export const stringify = obj => JSON.stringify(obj, null, 2);

export const removeNElement = (array, N) =>
  array.slice(0, N).concat(array.slice(N + 1, array.length));

String.prototype.toUpperCaseFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
