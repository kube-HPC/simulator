import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import MissingIdError from 'components/MissingIdError';
import useToggle from 'hooks/useToggle';
import Info from './Info';
import usePath from './usePath';

const OverviewDrawer = () => {
  const { goTo, jobId } = usePath();
  const { setOff, isOn } = useToggle(true);

  const goBack = useCallback(() => {
    goTo.root();
  }, [goTo]);

  const item = useSelector(state => selectors.jobs.byId(state, jobId));

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goBack}
      onClose={setOff}
      width={DRAWER_SIZE.JOB_INFO}
      title={item?.pipeline?.name ?? jobId}>
      {item ? <Info job={item} /> : <MissingIdError />}
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
