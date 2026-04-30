import { useCallback } from 'react';
import { events } from 'utils';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import { useNavigate } from 'react-router-dom';
import { pipelineJustStartedVar } from 'cache';
import useActions from './useActions';
import styled from 'styled-components';
import { Button } from 'antd';

const ButtonLinkStyle = styled(Button)`
  padding: 0px;
`;

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

      events.emit('global_alert_msg', errorMessage, 'error');
    }
  }, []);

  const rerunPipeline = useCallback(
    async jobId => {
      try {
        const res = await client.post(`/exec/rerun`, { jobId });
        const gotoJobsTable = () => navigate('/jobs');

        events.emit(
          'global_alert_msg',
          <>
            Pipeline started, see{' '}
            <ButtonLinkStyle type="link" onClick={gotoJobsTable}>
              jobs
            </ButtonLinkStyle>
          </>,
          'success'
        );
      } catch (res) {
        const errorMessage =
          res.response?.data?.error?.message || res.message || 'Unknown error';
        events.emit('global_alert_msg', errorMessage, 'error');
      }
    },
    [navigate]
  );

  const updatePipeline = useCallback(
    async (data, LOCAL_STORAGE_KEY) => {
      try {
        let res = null;

        res = await client.put(`/store/pipelines`, { ...data });

        events.emit(
          'global_alert_msg',
          successMsg(res.data).PIPELINE_UPDATE,
          'success'
        );
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate('/pipelines');
      } catch (res) {
        events.emit(
          'global_alert_msg',
          res.response.data.error.message,
          'error'
        );
      }
    },
    [navigate]
  );

  const addPipeline = useCallback(
    async (data, LOCAL_STORAGE_KEY) => {
      try {
        let res = null;
        res = await client.post(`/store/pipelines`, { ...data });

        events.emit(
          'global_alert_msg',
          successMsg(res.data).PIPELINE_ADD,
          'success'
        );

        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate('/pipelines');
      } catch (res) {
        events.emit(
          'global_alert_msg',
          res.response.data.error.message,
          'error'
        );
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
