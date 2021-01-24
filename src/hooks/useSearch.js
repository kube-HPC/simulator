import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

/**
 * @template T
 * @type {(collection: T[], key: string) => T[]}
 */
export const useFilter = (collection, key) => {
  const filter = useSelector(selectors.autoCompleteFilter);
  const data = useMemo(
    () => collection.filter(item => item[key].includes(filter)),
    [collection, key, filter]
  );
  return data;
};
