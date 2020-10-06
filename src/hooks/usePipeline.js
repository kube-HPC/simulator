import { experimentsSchema } from 'config';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useActions, useDrawerEditor } from 'hooks';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { stringify } from 'utils';
import { tableFilterSelector } from 'utils/tableSelector';
import useExperiments from './useExperiments';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

const usePipeline = () => {
  const dataSource = useSelector(dataSelector);
  const dataStats = useSelector(
    state => state[STATE_SOURCES.PIPELINE_TABLE].dataStats
  );
  const { experimentId: experimentName } = useExperiments();

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

  return {
    dataSource,
    dataStats,
    remove: deleteStored,
    update: pipeline => update(stringify(pipeline)),
    execute: pipeline => execute(stringify(pipeline)),
  };
};

export default usePipeline;
