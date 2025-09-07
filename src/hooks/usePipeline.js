import { useCallback } from 'react';
import { message } from 'antd';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import { useNavigate } from 'react-router-dom';
import { pipelineJustStartedVar } from 'cache';
import useActions from './useActions';

const usePipeline = () => {
  const { updateStored } = useActions();
  const navigate = useNavigate();

  // const location = useLocation();
  // const { pageName } = useParams();

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

  const runPipeline = useCallback(async objVal => {
    try {
      const objPipeline = JSON.parse(JSON.stringify(objVal));
      delete objPipeline.nodes;

      await client.post(`exec/stored`, objPipeline);
      pipelineJustStartedVar(true);
      navigate('/pipelines');
    } catch (res) {
      const errorMessage =
        res.response?.data?.error?.message || res.message || 'Unknown error';

      message.error(errorMessage);
    }
  }, []);

  const rerunPipeline = useCallback(async jobId => {
    try {
      const res = await client.post(`/exec/rerun`, { jobId });
      message.success(successMsg(res.data).PIPELINE_START);
    } catch (res) {
      const errorMessage =
        res.response?.data?.error?.message || res.message || 'Unknown error';
      message.error(errorMessage);
    }
  }, []);

  const updatePipeline = useCallback(
    async (data, LOCAL_STORAGE_KEY) => {
      try {
        let res = null;

        res = await client.put(`/store/pipelines`, { ...data });
        message.success(successMsg(res.data).PIPELINE_UPDATE);
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate('/pipelines');
      } catch (res) {
        message.error(res.response.data.error.message);
      }
    },
    [navigate]
  );

  const addPipeline = useCallback(
    async (data, LOCAL_STORAGE_KEY) => {
      try {
        let res = null;
        res = await client.post(`/store/pipelines`, { ...data });

        message.success(successMsg(res.data).PIPELINE_ADD);

        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate('/pipelines');
      } catch (res) {
        message.error(res.response.data.error.message);
      }
    },
    [navigate]
  );

  return {
    updateCron,
    rerunPipeline,
    addPipeline,
    updatePipeline,
    runPipeline,
  };
};

export default usePipeline;
