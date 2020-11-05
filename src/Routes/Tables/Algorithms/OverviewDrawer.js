import React from 'react';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import { useAlgorithm } from 'hooks';
import { Redirect, useLocation } from 'react-router-dom';
import useToggle from 'hooks/useToggle';
import AlgorithmsTabs from './Tabs';
import usePath from './usePath';

export default () => {
  const { goTo, algorithmId, paths } = usePath();
  const { setOff, isOn } = useToggle(true);
  const { algorithm } = useAlgorithm(algorithmId);
  const location = useLocation();

  if (!algorithm)
    return <Redirect to={{ pathname: paths.root, search: location.search }} />;

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={algorithmId}>
      <AlgorithmsTabs name={algorithmId} />
    </Drawer>
  );
};
