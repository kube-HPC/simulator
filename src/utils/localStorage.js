export const setLsItem = (str, object) => window.localStorage.setItem(str, object);

export const getLsItem = str => window.localStorage.getItem(str);

export const getBooleanLSItem = str => {
  const storageItem = getLsItem(str);
  return storageItem === `true` || !storageItem ? true : false;
};

export const setLsObjectItem = (str, object) => setLsItem(str, JSON.stringify(object));

export const getLsObjectItem = (str, object) => {
  try {
    return JSON.parse(getLsItem(str, object));
  } catch (e) {
    return null;
  }
};
