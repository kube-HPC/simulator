import { useSelector } from 'react-redux';
import { selector } from 'utils';

const useStore = storeSource => {
  const data = useSelector(selector(storeSource));
  return data;
};

export default useStore;
