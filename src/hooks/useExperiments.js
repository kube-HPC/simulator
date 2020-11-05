import { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { experimentsSchema } from 'config';
import { STATE_SOURCES } from 'const';
import isEqual from 'lodash/isEqual';
import useActions from './useActions';

const useExperiments = () => {
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;
  const query = new URLSearchParams(search);

  const experimentId = useMemo(() => query.get('experiment') || 'main', [
    query,
  ]);

  const { dataSource, loading } = useSelector(
    state => state[STATE_SOURCES.EXPERIMENTS],
    isEqual
  );

  const setExperiment = useCallback(
    id => {
      id === 'main' ? query.delete('experiment') : query.set('experiment', id);
      history.push(`${pathname}?${query.toString()}`);
    },
    [query, history, pathname]
  );

  const {
    addExperiment,
    deleteExperiment,
    triggerExperiment,
    changeExperiment,
  } = useActions();

  const { experimentName } = useSelector(state => state[STATE_SOURCES.META]);

  useEffect(() => {
    changeExperiment(experimentId);
  }, [changeExperiment, experimentId]);

  useEffect(() => {
    if (!loading && experimentName !== experimentId) {
      triggerExperiment();
    } else if (loading && experimentName === experimentId) {
      triggerExperiment();
    }
  }, [experimentName, loading, triggerExperiment, experimentId]);

  const defaultExperiment = dataSource.find(
    ({ name }) => name === experimentsSchema.default
  );
  const restExperiments = dataSource.filter(
    ({ name }) => name !== experimentsSchema.default
  );

  return {
    experiments: [defaultExperiment, ...restExperiments],
    add: addExperiment,
    remove: deleteExperiment,
    setExperiment,
    experimentId,
  };
};

export default useExperiments;
