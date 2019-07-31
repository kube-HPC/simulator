export const setLocalStorageItem = (str, object) =>
  window.localStorage.setItem(str, object);

export const getLocalStorageItem = str => window.localStorage.getItem(str);

export const getBooleanLocalStorageItem = str =>
  getLocalStorageItem(str) === 'true' ? true : false;
