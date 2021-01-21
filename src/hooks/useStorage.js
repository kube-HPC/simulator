import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

const useStorage = () => {
  const storage = useSelector(selectors.storage);
  return { storage };
};

export default useStorage;
