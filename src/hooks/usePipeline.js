import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  updateStored,
  execStored,
  deleteStored,
  cronStop as cStart,
  cronStart as cStop,
} from 'actions/pipeline.action';

import { LEFT_SIDEBAR_NAMES } from 'const';
import { tableFilterSelector } from 'utils/tableSelector';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

const usePipeline = () => {
  const dataSource = useSelector(dataSelector);
  const dataStats = useSelector(state => state.pipelineTable.dataStats);

  const dispatch = useDispatch();

  const update = useCallback(p => dispatch(updateStored(JSON.parse(p))), [dispatch]);
  const execute = useCallback(p => dispatch(execStored(JSON.parse(p))), [dispatch]);
  const remove = useCallback(e => dispatch(deleteStored(e)), [dispatch]);
  const cronStart = useCallback((e, p) => dispatch(cStart(e, p)), [dispatch]);
  const cronStop = useCallback((e, p) => dispatch(cStop(e, p)), [dispatch]);

  return {
    cronStart,
    cronStop,
    dataSource,
    dataStats,
    remove,
    execute,
    update,
  };
};

export default usePipeline;
