export const setLSItem = (str, object) =>
  window.localStorage.setItem(str, object);

export const getLSItem = str => window.localStorage.getItem(str);

export const getBooleanLSItem = str => {
  const storageItem = getLSItem(str);
  return storageItem === 'true' || !storageItem ? true : false;
};
