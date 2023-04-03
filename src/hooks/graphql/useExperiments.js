import { useEffect, useMemo, useCallback, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery, useReactiveVar, useLazyQuery } from '@apollo/client';
import { EXPERIMENTS_QUERY } from 'graphql/queries';
import { metaVar } from 'cache';
import useActions from '../useActions';

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
  const metaMode = useReactiveVar(metaVar);
  const [isLoading, setIsLoading] = useState(false);
  const [experiments, setExperiments] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const experimentId = useMemo(() => query.get('experiment') || 'main', [
    query,
  ]);

  const queryGql = useQuery(EXPERIMENTS_QUERY);

  useEffect(() => {
    if (!queryGql.loading) {
      setExperiments(
        queryGql?.data?.experiments
          ?.slice()
          .sort((a, b) =>
            a.name === schema.DEFAULT ? -1 : b.name === schema.DEFAULT ? 1 : 0
          ) || []
      );
    }
  }, [queryGql.loading, queryGql.data, queryGql.error]);

  const [getLazyExperiments] = useLazyQuery(EXPERIMENTS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onCompleted: res => {
      console.log(res);
      setExperiments(
        res?.experiments
          ?.slice()
          .sort((a, b) =>
            a.name === schema.DEFAULT ? -1 : b.name === schema.DEFAULT ? 1 : 0
          ) || []
      );
    },
  });

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

  // const experimentName = useSelector(selectors.meta.experimentName);
  const { experimentName } = metaMode;

  useEffect(() => {
    metaVar({ experimentName: experimentId });
    changeExperiment(experimentId);
  }, [changeExperiment, experimentId]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(queryGql.loading);
    }

    if (!(isLoading ^ (experimentName === experimentId)))
      setExperimentLoading({ to: true });
  }, [experimentName, queryGql.loading, setExperimentLoading, experimentId]);

  /* moves the default experiment to the top of the list */

  return {
    getLazyExperiments,
    experiments,
    add: addExperiment,
    remove: deleteExperiment,
    setExperiment,
    experimentId,
  };
};

export default useExperiments;
