import { useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { selectors } from 'reducers';
import useActions from './useActions';

export const schema = {
  DEFAULT: 'main',
  SHOW_ALL: 'show-all',
};

// used on the socket middleware
export const getExperimentName = search => {
  const query = new URLSearchParams(search);
  return query.get('experiment') || schema.DEFAULT;
};

const useExperiments = () => {
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const experimentId = useMemo(() => query.get('experiment') || 'main', [
    query,
  ]);

  const { collection: experiments, loading } = useSelector(
    selectors.experiments.all
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
    changeExperiment,
    setExperimentLoading,
  } = useActions();

  const experimentName = useSelector(selectors.meta.experimentName);

  useEffect(() => {
    changeExperiment(experimentId);
  }, [changeExperiment, experimentId]);

  useEffect(() => {
    if (!(loading ^ (experimentName === experimentId)))
      setExperimentLoading({ to: true });
  }, [experimentName, loading, setExperimentLoading, experimentId]);

  /* moves the default experiment to the top of the list */
  const sortedExperiments = useMemo(
    () =>
      experiments
        .slice()
        .sort((a, b) =>
          a.name === schema.DEFAULT ? -1 : b.name === schema.DEFAULT ? 1 : 0
        ),
    [experiments]
  );

  return {
    experiments: sortedExperiments,
    add: addExperiment,
    remove: deleteExperiment,
    setExperiment,
    experimentId,
  };
};

export default useExperiments;
