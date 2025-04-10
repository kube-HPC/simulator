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

export const getQueryParams = nameParam => {
  const url = new URL(window.location.href.replace('#', ''));
  return new URLSearchParams(url.search).get(nameParam);
};

export const lightenColor = (_color, percent) => {
  // Check if color is in hex format
  let color = _color;
  if (color.charAt(0) === '#') {
    color = color.substring(1);
  }

  // Parse the hex values to RGB
  const num = parseInt(color, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  // Ensure values are within range (0-255)
  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  // Convert back to hex
  let newColor = ((r << 16) | (g << 8) | b).toString(16);

  // Add leading zeros if needed
  while (newColor.length < 6) {
    newColor = `0${newColor}`;
  }

  return `#${newColor}`;
};
