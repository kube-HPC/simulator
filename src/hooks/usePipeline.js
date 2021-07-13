import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { message } from 'antd';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import useActions from './useActions';
import { useFilter } from './useSearch';

const usePipeline = () => {
  const collection = useSelector(selectors.pipelines.collection.all);

  const dataStats = useSelector(selectors.pipelines.stats.all);
  const filtered = useFilter(collection, ['name']);
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

  const rerunPipeline = useCallback(async (jobId) => {
    try {
      const res = await client.post('/exec/rerun', { jobId });
      message.success(successMsg(res.data).PIPELINE_START);
    } catch (error) {
      message.error(error.message);
    }
  }, []);

  return {
    collection: filtered,
    dataStats,
    updateCron,
    rerunPipeline,
  };
};

export default usePipeline;
