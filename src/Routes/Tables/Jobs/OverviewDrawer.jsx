import React from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import styled from 'styled-components';
// import { useSelector } from 'react-redux';
// import { selectors } from 'reducers';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import MissingIdError from 'components/MissingIdError';
import useToggle from 'hooks/useToggle';
import { useQuery } from '@apollo/client';
import { usePolling } from 'hooks';
import { JOB_BY_ID_QUERY } from 'graphql/queries';
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
  const query = useQuery(JOB_BY_ID_QUERY, {
    variables: { jobId },
  });
  usePolling(query, 6000);
  // const item = useSelector(state => selectors.jobs.byId(state, jobId));

  return (
    <DrawerOverView
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.JOB_INFO}>
      <>
        <TitleDataJob job={query?.data?.job} />
        <TabDrawer>
          <TabDrawerText>{DRAWER_TITLES.JOB_INFO}</TabDrawerText>
        </TabDrawer>
        {/* item ? <Info job={item} /> : <MissingIdError /> */}
        {query?.data?.job ? (
          <Info job={query?.data?.job} />
        ) : (
          <MissingIdError />
        )}
      </>
    </DrawerOverView>
  );
};

export default React.memo(OverviewDrawer);
