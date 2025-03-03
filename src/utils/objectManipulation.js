import cleanDeep from 'clean-deep';

export const tryParseJson = val => {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

export const deepCopyFromKeyValue = (schemaObject, keyValueObject) => {
  if (typeof schemaObject !== 'object' || schemaObject === null)
    return schemaObject;

  let value;

  const outObject = Array.isArray(schemaObject) ? [] : {};

  Object.keys(schemaObject).forEach(key => {
    value = schemaObject[key];

    if (typeof value === 'object')
      outObject[key] = deepCopyFromKeyValue(value, keyValueObject);
    else if (keyValueObject[key]) outObject[key] = keyValueObject[key];
  });

  return outObject;
};

export const flattenObjKeyValue = obj =>
  obj &&
  Object.assign(
    {},
    ...(function _flatten(o) {
      return [].concat(
        ...Object.keys(o).map(k =>
          o[k] && typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] }
        )
      );
    })(obj)
  );

export const isValuesFiltersEmpty = obj =>
  (obj &&
    Object.values((obj && obj) || {}).some(x =>
      typeof x === 'object'
        ? Object.values((x && x) || {}).some(y => y != null)
        : x != null
    )) ||
  false;

export const removeNullUndefined = obj =>
  obj &&
  Object.entries(obj)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

export const removeNullUndefinedCleanDeep = obj =>
  cleanDeep(obj, {
    emptyArrays: false,
    emptyObjects: false,
    emptyStrings: false,
    NaNValues: true,
  });

export const mergeObjects = (obj1, obj2) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj1) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        mergeObjects(obj1[key], obj2[key]);
      } else {
        // eslint-disable-next-line no-prototype-builtins, no-param-reassign
        obj2[key] = obj1[key];
      }
    }
  }
  return obj2;
};

export const transformFieldsToObject = values => {
  if (!Array.isArray(values)) return {};

  return values.reduce((acc, item) => {
    if (item && typeof item === 'object') {
      const { key, value } = item;
      if (key && value !== undefined) {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
};

export const transformObjectToArray = (obj = {}) =>
  obj && typeof obj === 'object'
    ? Object.entries(obj).map(([key, value]) => ({ key, value }))
    : [];

export const setTypeVolume = objVolumes =>
  Array.isArray(objVolumes)
    ? objVolumes
        .filter(obj => obj && typeof obj === 'object' && obj.name)
        .map(obj => {
          const typeVolume = obj.typeVolume || 'emptyDir';
          return {
            name: obj.name,
            [typeVolume]: obj[typeVolume],
          };
        })
    : [];
