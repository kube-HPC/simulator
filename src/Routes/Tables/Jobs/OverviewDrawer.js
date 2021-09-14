import React from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import MissingIdError from 'components/MissingIdError';
import useToggle from 'hooks/useToggle';
import Info from './Info';
import usePath from './usePath';
import { DRAWER_TITLES } from '../../../const';

const OverviewDrawer = () => {
  const { goTo, jobId } = usePath();
  const { setOff, isOn } = useToggle(true);

  const item = useSelector(state => selectors.jobs.byId(state, jobId));

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.JOB_INFO}
      title={item?.pipeline?.name ?? jobId}>
      <>
        <TabDrawer>
          <TabDrawerText>{DRAWER_TITLES.JOB_INFO}</TabDrawerText>
        </TabDrawer>
        {item ? <Info job={item} /> : <MissingIdError />}
      </>
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
