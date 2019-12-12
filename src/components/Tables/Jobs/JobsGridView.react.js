import React from 'react';
import { useJobs } from 'hooks';
import { Card, Ellipsis } from 'components/common';
import JobProgress from './JobProgress.react';

const gridStyle = {
  width: '25%',
};

const { Meta, Grid: GridItem } = Card;

const toGrid = dataSource =>
  dataSource.map(({ key, pipeline: { jobId, name }, status }) => {
    const description = (
      <>
        <Ellipsis text={jobId} copyable />
        {/* <ProgressStatus status={status} /> */}
      </>
    );

    const progress = <JobProgress status={status} type="circle" width={40} />;
    return (
      <GridItem key={key} style={gridStyle}>
        <Meta avatar={progress} title={name} description={description} />
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return <>{toGrid(dataSource)}</>;
};

export default JobsGridView;
