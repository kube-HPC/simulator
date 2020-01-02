import { createStore } from 'reusable';
import { STATE_SOURCES, LOCAL_STORAGE_KEYS } from 'const';
import { useLocalStorage, useActions, useStore } from 'hooks';
import { stringify } from 'utils';
import { isImmutable } from 'seamless-immutable';

const useFilters = () => {
  const { filterByType: set } = useActions();
  const value = useStore(STATE_SOURCES.FILTER_TYPES);

  useLocalStorage({ value: stringify(value), key: LOCAL_STORAGE_KEYS.FILTER_TYPES });
  return { value: value && isImmutable(value) ? value.asMutable() : value, set };
};

export default createStore(useFilters);
