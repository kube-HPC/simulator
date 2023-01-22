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
