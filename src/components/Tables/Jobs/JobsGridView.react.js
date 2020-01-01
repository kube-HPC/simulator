import { Tag } from 'antd';
import { Card, Ellipsis, FlexBox, ProgressStatus } from 'components/common';
import { cardOptions } from 'config/template/graph-options.template';
import { useJobs } from 'hooks';
import React, { memo } from 'react';
import styled from 'styled-components';
import { toUpperCaseFirstLetter } from 'utils';
import JobActions from './JobActions.react';
import JobGraph from './JobGraph.react';
import JobStats from './JobNodeStats.react';
import JobProgress from './JobProgress.react';
import JobTime from './JobTime.react';

const gridStyle = {
  width: '25%',
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

const TagsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  .ant-tag {
    margin-right: 2px;
  }
`;

const Container = styled(FlexBox.Auto)`
  width: 80px;
`;

const FlexContainer = styled(FlexBox.Auto)`
  height: 100%;
`;

const toGrid = dataSource =>
  dataSource.map(job => {
    const { key, pipeline, status, results, graph } = job;
    const { jobId, name, startTime, types } = pipeline;

    const title = (
      <FlexBox.Auto>
        <Ellipsis text={name} />
        <JobStats status={status} />
      </FlexBox.Auto>
    );

    const description = (
      <FlexBox.Auto justify="start" align="start" gutter={[0, 5]} direction="column">
        <Ellipsis text={jobId} copyable length={35} />
        <TagsContainer>
          {types ? (
            types.map(type => <Tag key={type}>{toUpperCaseFirstLetter(type)}</Tag>)
          ) : (
            <Tag>No Type</Tag>
          )}
        </TagsContainer>
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
        <FlexContainer justify="center">
          <Meta avatar={progress} title={title} description={description} />
          <JobGraph graph={{ ...graph, jobId: key }} options={cardOptions} isMinified />
          <ActionsHidden job={job} />
        </FlexContainer>
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return <>{toGrid(dataSource)}</>;
};

export default memo(JobsGridView);
