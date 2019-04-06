export const stringify = obj => JSON.stringify(obj, null, 2);

String.prototype.toUpperCaseFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
