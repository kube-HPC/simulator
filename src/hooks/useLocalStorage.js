import { useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from 'const';
import { setLSItem } from 'utils';

const { IS_TABLE_VIEW: IS_GRID_VIEW } = LOCAL_STORAGE_KEYS;

const useLocalStorage = ({ isTableView }) => {
  useEffect(() => {
    setLSItem(IS_GRID_VIEW, isTableView);
  }, [isTableView]);
};

export default useLocalStorage;
