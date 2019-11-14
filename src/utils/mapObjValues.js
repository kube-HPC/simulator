import fromEntries from 'object.fromentries';

if (!Object.fromEntries) {
  fromEntries.shim();
}

const isObject = obj => typeof obj === 'object' && obj !== null;
const identity = ({ value }) => value;
const noFilter = () => true;
const noPredicate = () => false;

/**
 * @param  {object} obj - An object to apply mapping.
 * @param  {function} predicate - Predicate function for indicating if object value is empty.
 * @param  {function} mapper - Mapping function to apply on object values.
 */
const mapObjValues = ({
  obj,
  predicate = noFilter,
  mapper = identity,
  mapPredicate = noPredicate,
}) =>
  isObject(obj) &&
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => predicate({ key, value }))
      .map(([key, value]) =>
        mapPredicate({ key, value }) || !isObject(value)
          ? [key, mapper({ key, value })]
          : [key, mapObjValues({ obj: value, predicate, mapper })],
      ),
  );

export default mapObjValues;
