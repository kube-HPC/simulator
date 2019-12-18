import React, { memo } from 'react';
import { useJobs } from 'hooks';
import { Card, Ellipsis, ProgressStatus, FlexBox } from 'components/common';
import JobProgress from './JobProgress.react';
import JobTime from './JobTime.react';
import styled from 'styled-components';
import JobGraphCard from './JobGraphCard.react';
import JobActions from './JobsActions.react';
import JobStats from './JobNodeStats.react';

const gridStyle = {
  width: '25%',
};

const { Meta, Grid } = Card;

const ActionsHidden = styled(JobActions)``;

const GridItem = styled(Grid)`
  ${ActionsHidden} {
    transition: all 0.3s;
    opacity: 0;
  }
  &:hover,
  &:focus {
    ${ActionsHidden} {
      opacity: 1;
    }
  }
`;

const Container = styled(FlexBox.Auto)`
  width: 80px;
`;

const toGrid = dataSource =>
  dataSource.map(item => {
    const { key, pipeline, status, results, graph } = item;
    const { jobId, name, startTime } = pipeline;

    const title = (
      <FlexBox.Auto>
        {name}
        <JobStats status={status} />
      </FlexBox.Auto>
    );

    const description = (
      <FlexBox.Auto justify="start" align="start" gutter={[0, 5]}>
        <Ellipsis text={jobId} copyable length={35} />
        <JobTime results={results} startTime={startTime} />
      </FlexBox.Auto>
    );

    const progress = (
      <Container direction="column" gutter={[0, 10]}>
        <JobProgress status={status} type="circle" width={40} />
        <ProgressStatus status={status.status} />
      </Container>
    );

    return (
      <GridItem key={key} style={gridStyle}>
        <Meta avatar={progress} title={title} description={description} />
        <JobGraphCard graph={{ ...graph, jobId: key }} pipeline={{ pipeline, status, results }} />
        <ActionsHidden key={key} pipeline={pipeline} status={status.status} results={results} />
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return <>{toGrid(dataSource)}</>;
};

export default memo(JobsGridView);
