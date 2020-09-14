import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const useStorage = () => {
  const { dataSource } = useSelector(state => state[STATE_SOURCES.STORAGE]);
  return { storage: dataSource };
};

export default useStorage;
