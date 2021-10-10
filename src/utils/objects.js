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
  Object.assign(
    {},
    ...(function _flatten(o) {
      return [].concat(
        ...Object.keys(o).map(k =>
          typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] }
        )
      );
    })(obj)
  );
