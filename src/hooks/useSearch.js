import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import lodash from 'lodash';

/**
 * @template T
 * @type {(collection: T[], keys: string[]) => T[]}
 */
export const useFilter = (collection, keys) => {
  const filter = useSelector(selectors.autoCompleteFilter);
  const data = useMemo(() => {
    if (filter === '') return collection;
    return collection.filter(item =>
      keys.some(key => {
        const entry = lodash.get(item, key, '');
        return entry ? entry.includes(filter) : false;
      })
    );
  }, [collection, keys, filter]);
  return data;
};
