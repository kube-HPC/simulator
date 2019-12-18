import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { useJobs } from 'hooks';
import { Card, Ellipsis, ProgressStatus, FlexBox } from 'components/common';
import JobProgress from './JobProgress.react';
import JobTime from './JobTime.react';
import styled from 'styled-components';
import JobGraphCard from './JobGraphCard.react';

const gridStyle = {
  width: '25%',
};

const { Meta, Grid } = Card;

const GridItem = styled(Grid)`
  cursor: pointer;
`;

const CardFlex = ({ children, ...props }) => (
  <FlexBox direction="column" {...props}>
    {Children.map(children, (item, i) => (
      <FlexBox.Item key={i}>{item}</FlexBox.Item>
    ))}
  </FlexBox>
);

CardFlex.propTypes = {
  children: PropTypes.node.isRequired,
};

const Container = styled(CardFlex)`
  width: 80px;
`;

const toGrid = dataSource =>
  dataSource.map(item => {
    const { key, pipeline, status, results, graph } = item;
    const { jobId, name, startTime } = pipeline;

    const description = (
      <CardFlex justify="start" align="start" gutter={[0, 5]}>
        <Ellipsis text={jobId} copyable />
        <JobTime results={results} startTime={startTime} />
      </CardFlex>
    );

    const progress = (
      <Container direction="column" gutter={[0, 10]}>
        <JobProgress status={status} type="circle" width={40} />
        <ProgressStatus status={status.status} />
      </Container>
    );

    return (
      <GridItem key={key} style={gridStyle}>
        <Meta avatar={progress} title={name} description={description} />
        <JobGraphCard graph={{ ...graph, jobId: key }} pipeline={{ pipeline, status, results }} />
      </GridItem>
    );
  });

const JobsGridView = () => {
  const { dataSource } = useJobs();
  return <>{toGrid(dataSource)}</>;
};

export default JobsGridView;
