import { useActions } from 'hooks';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers/pipeline.reducer';

const usePipeline = () => {
  const dataSource = useSelector(selectors.collection.filtered);

  const dataStats = useSelector(selectors.stats.all);

  const { deleteStored } = useActions();

  return {
    dataSource,
    dataStats,
    remove: deleteStored,
  };
};

export default usePipeline;
