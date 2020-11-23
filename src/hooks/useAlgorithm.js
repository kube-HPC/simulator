import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

const useAlgorithm = () => {
  const algorithmSource = useSelector(selectors.algorithms.collection.filtered);
  const buildsSource = useSelector(selectors.algorithms.builds.entities);

  const collection = algorithmSource.map(item => ({
    ...item,
    builds: buildsSource[item.name],
  }));

  return {
    dataSource: collection,
  };
};

export default useAlgorithm;
