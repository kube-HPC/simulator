// import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useActions } from 'hooks';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers/pipeline.reducer';
// import { tableFilterSelector } from 'utils/tableSelector';

// const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

const usePipeline = () => {
  // const dataSource = useSelector(dataSelector);

  const dataSource = useSelector(selectors.collection.all);
  const dataStats = useSelector(selectors.stats.all);

  const { deleteStored } = useActions();

  return {
    dataSource,
    dataStats,
    remove: deleteStored,
  };
};

export default usePipeline;
