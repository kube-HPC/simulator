import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useJobs } from 'hooks';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import useToggle from 'hooks/useToggle';
import JobInfo from './JobInfo.react';

const OverviewDrawer = () => {
  const { jobId } = useParams();
  const { setOff, isOn } = useToggle(true);
  const history = useHistory();
  const { dataSource } = useJobs();
  const goBack = useCallback(() => {
    history.replace('/jobs');
  }, [history]);

  const item = dataSource.find(job => job.key === jobId);

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goBack}
      onClose={setOff}
      width={DRAWER_SIZE.JOB_INFO}
      title={item.pipeline.name}>
      <JobInfo jobId={jobId} />
    </Drawer>
  );
};

export default OverviewDrawer;
