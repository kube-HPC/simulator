import isEqual from 'lodash/isEqual';
import { useSelector } from 'react-redux';
import { selector } from 'utils';

const useStore = storeSource => {
  const data = useSelector(selector(storeSource), isEqual);
  return data;
};

export default useStore;
