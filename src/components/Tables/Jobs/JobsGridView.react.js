import React, { memo } from 'react';
import { useJobs } from 'hooks';
import { Card, Ellipsis, ProgressStatus, FlexBox } from 'components/common';
import JobProgress from './JobProgress.react';
import JobTime from './JobTime.react';
import styled from 'styled-components';
import JobGraphCard from './JobGraphCard.react';
import JobActions from './JobActions.react';
import JobStats from './JobNodeStats.react';
import { cardOptions } from 'config/template/graph-options.template';
import { Tag } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';

const gridStyle = {
  width: '25%',
  height: '320px',
};

const { Meta, Grid } = Card;

const ActionsHidden = styled(JobActions)``;

const GridItem = styled(Grid)`
  .ant-card-meta {
    margin: 0px;
  }
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
  dataSource.map(job => {
    const { key, pipeline, status, results, graph } = job;
    const { jobId, name, startTime } = pipeline;

    const { types } = pipeline;

    const title = (
      <FlexBox.Auto>
        <FlexBox.Auto>
          {types.map(type => (
            <Tag key={type}>{toUpperCaseFirstLetter(type)}</Tag>
          ))}
          {name}
        </FlexBox.Auto>
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
        <JobGraphCard graph={{ ...graph, jobId: key }} options={cardOptions} isMinified />
        <ActionsHidden job={job} />
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return <>{toGrid(dataSource.slice(0, 10))}</>;
};

export default memo(JobsGridView);
