import { LOCAL_STORAGE_KEYS, STATE_SOURCES } from 'const';
import isEqual from 'lodash/isEqual';
import { useSelector } from 'react-redux';
import useActions from './useActions';
import useLocalStorage from './useLocalStorage';

const useExperiments = () => {
  const { dataSource, value } = useSelector(state => state[STATE_SOURCES.EXPERIMENTS], isEqual);
  const { experimentChange, addExperiment, deleteExperiment } = useActions();

  useLocalStorage({ value, key: LOCAL_STORAGE_KEYS.EXPERIMENT });

  return {
    experiments: dataSource,
    value,
    set: experimentChange,
    add: addExperiment,
    remove: deleteExperiment,
  };
};

export default useExperiments;
