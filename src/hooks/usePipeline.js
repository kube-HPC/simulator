import React, { useCallback } from 'react';
import styled from 'styled-components';
import { message, Button } from 'antd';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import { useNavigate } from 'react-router-dom';
import useActions from './useActions';

const ButtonLinkStyle = styled(Button)`
  padding: 0px;
`;

const usePipeline = () => {
  const { updateStored } = useActions();
  const navigate = useNavigate();

  const gotoJobsTable = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

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
      navigate('/pipelines');

      message.success(
        <>
          Pipeline started, see{' '}
          <ButtonLinkStyle type="link" onClick={gotoJobsTable}>
            jobs
          </ButtonLinkStyle>
        </>
      );
    } catch (res) {
      message.error(res.response.data.error.message);
    }
  }, []);

  const rerunPipeline = useCallback(async jobId => {
    try {
      const res = await client.post(`/exec/rerun`, { jobId });
      message.success(successMsg(res.data).PIPELINE_START);
    } catch (error) {
      message.error(error.message);
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
