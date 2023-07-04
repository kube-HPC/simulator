import React, { useCallback } from 'react';
import styled from 'styled-components';
import { message, Button, Text } from 'antd';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import { useHistory } from 'react-router-dom';
import useActions from './useActions';

const ButtonLinkStyle = styled(Button)`
  padding: 0px;
`;

const usePipeline = () => {
  const { updateStored } = useActions();
  const history = useHistory();

  const gotoJobsTable = useCallback(() => {
    history.push('/jobs');
  }, [history]);

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
      history.push('/pipelines');

      message.success(
        <Text>
          Pipeline started,{' '}
          <ButtonLinkStyle type="link" onClick={gotoJobsTable}>
            check Jobs table
          </ButtonLinkStyle>
        </Text>
      );
    } catch (error) {
      message.error(error.message);
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
        res = await client.post(`/store/pipelines`, { ...data });

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
    updateCron,
    rerunPipeline,
    addPipeline,
    updatePipeline,
    runPipeline,
  };
};

export default usePipeline;
