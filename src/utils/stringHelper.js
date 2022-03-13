export const stringify = obj => JSON.stringify(obj, null, 4);

export const toUpperCaseFirstLetter = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const sorter = (a, b) =>
  Number.isNaN(Number(a)) && Number.isNaN(Number(b))
    ? (a || '').localeCompare(b || '')
    : a - b;

export const splitByDot = str => str.split('.');

export const isJsonString = str => {
  try {
    // eslint-disable-next-line no-unused-vars
    const obj = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getColorByName = stringInput => {
  const stringUniqueHash = [...stringInput].reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  );
  return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
};
