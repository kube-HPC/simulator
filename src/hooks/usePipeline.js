import { useSelector } from 'react-redux';
import { selectors } from 'reducers/pipeline.reducer';
import { useFilter } from './useSearch';

const usePipeline = () => {
  const collection = useSelector(selectors.collection.all);

  const dataStats = useSelector(selectors.stats.all);
  const filtered = useFilter(collection, 'name');

  return {
    collection: filtered,
    dataStats,
  };
};

export default usePipeline;
