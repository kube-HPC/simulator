import { experimentsSchema } from 'config';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useActions, useDrawerEditor } from 'hooks';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { stringify } from 'utils';
import { message } from 'antd';
import successMsg from 'config/schema/success-messages.schema';
import axios from 'axios';

import { tableFilterSelector } from 'utils/tableSelector';
import useExperiments from './useExperiments';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

const usePipeline = () => {
  const dataSource = useSelector(dataSelector);
  const dataStats = useSelector(
    state => state[STATE_SOURCES.PIPELINE_TABLE].dataStats
  );
  const { value: experimentName } = useExperiments();

  const { deleteStored, updateStored, execStored } = useActions();

  const onSubmitExec = useCallback(
    pipeline => {
      const parsed = JSON.parse(pipeline);
      execStored(
        experimentName === experimentsSchema.showAll
          ? parsed
          : { experimentName, ...parsed }
      );
    },
    [execStored, experimentName]
  );

  const onSubmitUpdate = useCallback(
    pipeline => updateStored(JSON.parse(pipeline)),
    [updateStored]
  );

  const { open: execute } = useDrawerEditor({ onSubmit: onSubmitExec });
  const { open: update } = useDrawerEditor({ onSubmit: onSubmitUpdate });

  const url = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);

  const rerunRawPipeline = useCallback(
    async (pipeline, jobId) => {
      const {
        jobId: deleteJobId,
        flowInputMetadata,
        startTime,
        lastRunResult,
        types,
        ...cleanPipeline
      } = pipeline;
      let { flowInput } = cleanPipeline;
      try {
        if (flowInput?.truncated) {
          const flowInputRes = await axios.get(`${url}/flowInput/${jobId}`);
          if (flowInputRes.data) {
            flowInput = flowInputRes.data;
          }
        }

        const res = await axios.post(`${url}/exec/raw`, {
          ...cleanPipeline,
          flowInput,
        });
        message.success(successMsg(res.data).PIPELINE_START);
      } catch (error) {
        message.error(error.message);
      }
    },
    [url]
  );
  return {
    dataSource,
    dataStats,
    remove: deleteStored,
    update: pipeline => update(stringify(pipeline)),
    execute: pipeline => execute(stringify(pipeline)),
    rerunRawPipeline,
  };
};

export default usePipeline;
