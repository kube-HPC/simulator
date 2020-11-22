import { useMemo } from 'react';
import { useAlgorithm } from 'hooks';
import usePath from './usePath';

export default () => {
  const { algorithmId } = usePath();
  const { dataSource } = useAlgorithm();

  const activeAlgorithm = useMemo(
    () => dataSource.find(item => item.name === algorithmId),
    [algorithmId, dataSource]
  );

  return {
    activeAlgorithm,
    algorithmId,
  };
};
