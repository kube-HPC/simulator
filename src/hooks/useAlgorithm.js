import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { useFilter } from 'hooks/useSearch';

const useAlgorithm = () => {
  const algorithmSource = useSelector(selectors.algorithms.collection.all);
  const buildsSource = useSelector(selectors.algorithms.builds.entities);
  const filtered = useFilter(algorithmSource, 'name');

  const collection = filtered.map(item => ({
    ...item,
    builds: buildsSource[item.name],
  }));

  return {
    collection,
  };
};

export default useAlgorithm;
