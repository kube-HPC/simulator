/**
 * Removes keys where the value is null
 *
 * @type {(obj: object) => object}
 */
const pruneObject = obj =>
  Object.entries(obj).reduce(
    (acc, [key, value]) =>
      value === null
        ? acc
        : {
            ...acc,
            [key]: typeof value === 'object' ? pruneObject(value) : value,
          },
    {}
  );

export default pruneObject;
