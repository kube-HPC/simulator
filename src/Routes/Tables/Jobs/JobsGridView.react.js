import { Card, Ellipsis, FlexBox } from 'components/common';
import { setCardOptions } from 'config/template/graph-options.template';
import { useJobs } from 'hooks';
import React, { memo } from 'react';
import styled from 'styled-components';
import JobActions from './JobActions.react';
import JobGraph from './JobGraph.react';
import JobStats from './JobNodeStats.react';
import JobProgress from './JobProgress.react';
import JobStatus from './JobStatus.react';
import JobTime from './JobTime.react';
import JobTypes from './JobTypes.react';

const gridStyle = {
  width: `25%`,
  padding: `24px 0px`,
};

const { Meta, Grid } = Card;

const ActionsHidden = styled(JobActions)``;

const GridItem = styled(Grid)`
  .ant-card-meta {
    margin: 0px;
  }
  ${ActionsHidden} {
    transition: opacity 0.5s ease;
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

const FlexContainer = styled(FlexBox.Auto)`
  height: 100%;
`;

const LENGTH = 20;

const toGrid = dataSource =>
  dataSource.map(job => {
    const { key, pipeline, status, results, graph } = job;
    const { jobId, name, startTime, types } = pipeline;

    const title = (
      <FlexBox.Auto>
        <Ellipsis text={name} />
        <JobTypes types={types} />
      </FlexBox.Auto>
    );

    const description = (
      <FlexBox.Auto>
        <Container direction="column" gutter={[0, 10]}>
          <JobProgress status={status} type="circle" width={40} />
          <JobStatus status={status} />
        </Container>
        <FlexBox.Auto
          justify="start"
          align="top"
          gutter={[0, 5]}
          direction="column">
          <Ellipsis text={jobId} copyable length={LENGTH} />
          <JobTime results={results} startTime={startTime} length={LENGTH} />
          <JobStats status={status} />
        </FlexBox.Auto>
      </FlexBox.Auto>
    );

    return (
      <GridItem key={key} style={gridStyle}>
        <FlexContainer justify="center" direction="column">
          <Meta title={title} description={description} />
          <JobGraph
            graph={{ ...graph, jobId: key }}
            setOptions={setCardOptions}
            isMinified
          />
          <ActionsHidden job={job} />
        </FlexContainer>
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return toGrid(dataSource);
};

export default memo(JobsGridView);
