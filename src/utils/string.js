export const stringify = obj => JSON.stringify(obj, null, 2);

export const toUpperCaseFirstLetter = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
