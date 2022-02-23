import React from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import MissingIdError from 'components/MissingIdError';
import useToggle from 'hooks/useToggle';
import Info from './Info';
import usePath from './usePath';
import { DRAWER_TITLES } from '../../../const';
import TitleDataJob from './TitleDataJob';

const DrawerOverView = styled(Drawer)`
  .ant-drawer-body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .ant-drawer-header {
    border-bottom: 1px solid #b1b1b1;
  }
`;

const OverviewDrawer = () => {
  const { goTo, jobId } = usePath();
  const { setOff, isOn } = useToggle(true);

  const item = useSelector(state => selectors.jobs.byId(state, jobId));
  console.log(item);
  return (
    <DrawerOverView
      getContainer={false}
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.JOB_INFO}>
      <>
        <TitleDataJob job={item} />
        <TabDrawer>
          <TabDrawerText>{DRAWER_TITLES.JOB_INFO}</TabDrawerText>
        </TabDrawer>
        {item ? <Info job={item} /> : <MissingIdError />}
      </>
    </DrawerOverView>
  );
};

export default React.memo(OverviewDrawer);
