import { useEffect } from 'react';
import { setLsItem } from 'utils';

const useLocalStorage = ({ value, key }) => {
  useEffect(() => {
    setLsItem(key, value);
  }, [value, key]);
};

export default useLocalStorage;
