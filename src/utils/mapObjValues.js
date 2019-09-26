const isObject = obj => typeof obj === 'object' && obj !== null;
const identity = v => v;
const noFilter = () => true;

/**
 * @param  {object} obj - An object to apply mapping.
 * @param  {function} predicate - Predicate function for indicating if object value is empty.
 * @param  {function} mapper - Mapping function to apply on object values.
 */
const mapObjValues = ({ obj, predicate = noFilter, mapper = identity }) =>
  isObject(obj) &&
  Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => predicate(v))
      .map(([k, v]) =>
        isObject(v) ? [k, mapObjValues({ obj: v, predicate, mapper })] : [k, mapper(v)]
      )
  );

export default mapObjValues;
