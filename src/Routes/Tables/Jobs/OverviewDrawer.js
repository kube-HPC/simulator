import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import MissingIdError from 'components/MissingIdError';
import useToggle from 'hooks/useToggle';
import { useQuery } from '@apollo/client';
import { JOB_BY_ID_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import usePath from './usePath';
import JobInfo from './Info';

const OverviewDrawer = () => {
  const { goTo, jobId } = usePath();
  const { setOff, isOn } = useToggle(true);
  const query = useQuery(JOB_BY_ID_QUERY, {
    variables: { jobId },
  });
  usePolling(query, 3000);
  const item = useSelector(state => selectors.jobs.byId(state, jobId));

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.JOB_INFO}
      title={item?.pipeline?.name ?? jobId}>
      {/* {item ? <JobInfo job={item} /> : <MissingIdError />} */}
      {query?.data?.job ? (
        <JobInfo job={query?.data?.job} />
      ) : (
        <MissingIdError />
      )}
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
