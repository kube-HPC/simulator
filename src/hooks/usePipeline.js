import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import useActions from './useActions';
import { useFilter } from './useSearch';

const usePipeline = () => {
  const collection = useSelector(selectors.pipelines.collection.all);

  const dataStats = useSelector(selectors.pipelines.stats.all);
  const filtered = useFilter(collection, 'name');
  const { updateStored } = useActions();
  const updateCron = useCallback(
    (pipeline, pattern) => {
      updateStored({
        ...pipeline,
        triggers: {
          ...pipeline.triggers,
          cron: { ...pipeline.triggers.cron, pattern },
        },
      });
    },
    [updateStored]
  );
  return {
    collection: filtered,
    dataStats,
    updateCron,
  };
};

export default usePipeline;
