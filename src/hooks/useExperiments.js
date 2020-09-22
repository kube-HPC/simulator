import { experimentsSchema } from 'config';
import { LOCAL_STORAGE_KEYS, STATE_SOURCES } from 'const';
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useActions from './useActions';
import useLocalStorage from './useLocalStorage';

const useExperiments = () => {
  const { dataSource, value, loading } = useSelector(
    state => state[STATE_SOURCES.EXPERIMENTS],
    isEqual
  );
  const {
    experimentChange,
    addExperiment,
    deleteExperiment,
    triggerExperiment,
  } = useActions();

  const { experimentName } = useSelector(state => state[STATE_SOURCES.META]);

  useEffect(() => {
    if (!loading && experimentName !== value) {
      triggerExperiment();
    } else if (loading && experimentName === value) {
      triggerExperiment();
    }
  }, [experimentName, loading, triggerExperiment, value]);

  useLocalStorage({ value, key: LOCAL_STORAGE_KEYS.EXPERIMENT });

  const defaultExperiment = dataSource.find(
    ({ name }) => name === experimentsSchema.default
  );
  const restExperiments = dataSource.filter(
    ({ name }) => name !== experimentsSchema.default
  );

  return {
    experiments: [defaultExperiment, ...restExperiments],
    value,
    set: experimentChange,
    add: addExperiment,
    remove: deleteExperiment,
  };
};

export default useExperiments;
