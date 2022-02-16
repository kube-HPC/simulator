import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { message } from 'antd';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import { useHistory } from 'react-router-dom';
import useActions from './useActions';
import { useFilter } from './useSearch';

const usePipeline = () => {
  const collection = useSelector(selectors.pipelines.collection.all);

  const dataStats = useSelector(selectors.pipelines.stats.all);
  const filtered = useFilter(collection, ['name']);
  const { updateStored } = useActions();
  const history = useHistory();

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

  const rerunPipeline = useCallback(async jobId => {
    try {
      const res = await client.post('/exec/rerun', { jobId });
      message.success(successMsg(res.data).PIPELINE_START);
    } catch (error) {
      message.error(error.message);
    }
  }, []);

  const updatePipeline = useCallback(
    async (data, LOCAL_STORAGE_KEY) => {
      try {
        let res = null;

        res = await client.put('store/pipelines', { ...data });
        message.success(successMsg(res.data).PIPELINE_UPDATE);
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        history.push('/pipelines');
      } catch (res) {
        message.error(res.response.data.error.message);
      }
    },
    [history]
  );

  const addPipeline = useCallback(
    async (data, LOCAL_STORAGE_KEY) => {
      try {
        let res = null;
        res = await client.post('store/pipelines', { ...data });

        message.success(successMsg(res.data).PIPELINE_ADD);

        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        history.push('/pipelines');
      } catch (res) {
        message.error(res.response.data.error.message);
      }
    },
    [history]
  );

  return {
    collection: filtered,
    dataStats,
    updateCron,
    rerunPipeline,
    addPipeline,
    updatePipeline,
  };
};

export default usePipeline;
