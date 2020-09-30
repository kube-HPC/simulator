import React, { useCallback } from 'react';
import { Route, useHistory, useParams } from 'react-router-dom';
import { Table } from 'components';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import { useJobs } from 'hooks';
import useToggle from 'hooks/useToggle';
import JobInfo from './JobInfo.react';

const JobDrawer = () => {
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
      width={DRAWER_SIZE}
      title={item.pipeline.name}>
      <JobInfo jobId={jobId} />
    </Drawer>
  );
};

const JobsTable = () => {
  const { columns, dataSource, loading } = useJobs();
  const history = useHistory();
  const onRow = job => ({
    onDoubleClick: () => history.push(`/jobs/${job.key}`),
  });

  return (
    <>
      <Table
        loading={loading}
        onRow={onRow}
        expandIcon={false}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Route exact path="/jobs/:jobId" component={JobDrawer} />
    </>
  );
};

export default React.memo(JobsTable);
