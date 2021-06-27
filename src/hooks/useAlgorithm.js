import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { useFilter } from 'hooks/useSearch';
import { nodeKind } from '@hkube/consts';

const useAlgorithm = () => {
  const algorithmsCollection = useSelector(selectors.algorithms.collection.all);

  const buildsSource = useSelector(selectors.algorithms.builds.entities);
  const filtered = useFilter(
    algorithmsCollection.filter(a => !a.kind || a.kind === nodeKind.Algorithm),
    ['name', 'algorithmImage']
  );
  const collection = filtered.map(item => ({
    ...item,
    builds: buildsSource[item.name],
  }));

  return { collection };
};

export default useAlgorithm;
