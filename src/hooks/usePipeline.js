import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useActions } from 'hooks';
import { useSelector } from 'react-redux';
import { tableFilterSelector } from 'utils/tableSelector';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

const usePipeline = () => {
  const dataSource = useSelector(dataSelector);
  const dataStats = useSelector(state => state[STATE_SOURCES.PIPELINE_TABLE].dataStats);

  const { deleteStored, updateStored, execStored } = useActions();

  return {
    dataSource,
    dataStats,
    remove: deleteStored,
    execute: execStored,
    update: updateStored,
  };
};

export default usePipeline;
