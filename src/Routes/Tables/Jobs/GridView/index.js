import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Ellipsis, FlexBox } from 'components/common';
import { useJobsGrid } from 'hooks/graphql';
import Graph from './Graph';
import { generateStyles } from '../graphUtils';
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

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Description = styled.section`
  display: flex;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2ch;
`;

const LENGTH = 20;

const GridItems = ({ jobs }) => (
  <>
    {jobs.map(job => {
      const { key, pipeline, status, results, graph } = job;
      const { name, startTime, types } = pipeline;

      const title = (
        <FlexBox.Auto>
          <Ellipsis text={name} />
          <JobTypes types={types} />
        </FlexBox.Auto>
      );

      const description = (
        <Description>
          <StatusContainer>
            <JobProgress status={status} type="circle" width={40} />
            <JobStatus
              status={status}
              style={{ marginRight: 0, marginTop: '1em' }}
            />
          </StatusContainer>
          <StatsContainer>
            <NodeStats status={status} />
            <JobTime
              results={results}
              startTime={startTime}
              length={LENGTH}
              style={{ marginTop: 'auto' }}
            />
          </StatsContainer>
        </Description>
      );

      return (
        <GridItem key={key} style={{ textAlign: 'center' }}>
          <Meta title={title} description={description} />
          <Graph
            graph={{ ...graph, jobId: key }}
            setOptions={generateStyles}
            pipeline={pipeline}
          />
          <ActionsHidden job={job} />
        </GridItem>
      );
    })}
  </>
);

GridItems.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      pipeline: PropTypes.shape({
        name: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        types: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      status: PropTypes.string.isRequired,
      // eslint-disable-next-line
      results: PropTypes.object,
      // eslint-disable-next-line
      graph: PropTypes.object.isRequired,
    })
  ).isRequired,
};

const JobsGridView = () => {
  //  const { dataSource } = useJobs();
  const { collection } = useJobsGrid();

  return <GridItems jobs={collection} />;
};

export default memo(JobsGridView);
