import { useMemo } from 'react';
import { useAlgorithm } from 'hooks';
import usePath from './usePath';

export default () => {
  const { algorithmId, goTo } = usePath();

  const { dataSource } = useAlgorithm();
  const activeAlgorithm = useMemo(
    () => dataSource.find(item => item.id === algorithmId),
    [algorithmId, dataSource]
  );

  if (!activeAlgorithm) goTo.root();

  return {
    activeAlgorithm,
  };
};
