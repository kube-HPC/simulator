import { Card, Ellipsis, FlexBox } from 'components/common';
import { setCardOptions } from 'config/template/graph-options.template';
import { useJobs } from 'hooks';
import React, { memo } from 'react';
import styled from 'styled-components';
import Graph from './Graph';
import JobActions from '../JobActions';
import NodeStats from '../NodeStats';
import JobProgress from '../JobProgress';
import JobStatus from '../JobStatus';
import JobTime from '../JobTime';
import JobTypes from '../JobTypes';

const { Meta, Grid } = Card;

const ActionsHidden = styled(JobActions)``;

const GridItem = styled(Grid)`
  width: 25%;
  padding: 2em;
  .ant-card-meta {
    margin: 0px;
  }
  ${ActionsHidden} {
    transition: opacity 0.5s ease;
    opacity: 0;
    margin: 0 auto;
    width: 100%;
    text-align: center;
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
          <NodeStats status={status} />
        </FlexBox.Auto>
      </FlexBox.Auto>
    );

    return (
      <GridItem key={key}>
        <Meta title={title} description={description} />
        <Graph graph={{ ...graph, jobId: key }} setOptions={setCardOptions} />
        <ActionsHidden job={job} />
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return toGrid(dataSource);
};

export default memo(JobsGridView);
