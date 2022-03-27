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

        if (Array.isArray(entry)) {
          return entry.some(
            el =>
              Object.values(el).filter(s => s.toString().indexOf(filter) !== -1)
                .length > 0
          );
        }

        return entry ? entry.includes(filter) : false;
      })
    );
  }, [collection, keys, filter]);
  return data;
};
