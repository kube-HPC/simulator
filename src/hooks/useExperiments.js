import { LOCAL_STORAGE_KEYS, STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';
import useActions from './useActions';
import useLocalStorage from './useLocalStorage';

const useExperiments = () => {
  const { dataSource, value } = useSelector(state => state[STATE_SOURCES.EXPERIMENTS]);
  const { experimentChange } = useActions();

  useLocalStorage({ value, key: LOCAL_STORAGE_KEYS.EXPERIMENT });

  return { experiments: dataSource, value, set: experimentChange };
};

export default useExperiments;
