import React, { useCallback, useMemo } from 'react';
import { useJobs } from 'hooks';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import useToggle from 'hooks/useToggle';
import JobInfo from './JobInfo.react';
import usePath from './usePath';

const OverviewDrawer = () => {
  const { goTo, jobId } = usePath();
  const { setOff, isOn } = useToggle(true);
  const { dataSource } = useJobs();

  const goBack = useCallback(() => {
    goTo.root();
  }, [goTo]);

  const item = useMemo(() => dataSource.find(job => job.key === jobId), [
    dataSource,
    jobId,
  ]);

  if (!item) return null;

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

export default React.memo(OverviewDrawer);
