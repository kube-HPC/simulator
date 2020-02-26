import { LOCAL_STORAGE_KEYS, STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';
import useActions from './useActions';
import useLocalStorage from './useLocalStorage';

const useExperiments = () => {
  const { dataSource, selected } = useSelector(state => state[STATE_SOURCES.EXPERIMENTS]);
  const { experimentChange } = useActions();

  useLocalStorage({ value: selected, key: LOCAL_STORAGE_KEYS.EXPERIMENT });

  return { experiments: dataSource, value: selected, set: experimentChange };
};

export default useExperiments;
