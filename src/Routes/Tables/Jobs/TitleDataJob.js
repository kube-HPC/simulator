import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Ellipsis } from 'components/common';
import { USER_GUIDE } from 'const';
import NodeStats from './NodeStats';
import JobPriority from './JobPriority';
import JobStatus from './JobStatus';
import JobTime from './JobTime';
import JobTypes from './JobTypes';

const Id = jobID => (
  <Ellipsis className={USER_GUIDE.TABLE_JOB.ID_SELECT} copyable text={jobID} />
);
const Name = pipelineName => <Ellipsis text={pipelineName} />;
const StartTime = (startTime, { results }) => (
  <JobTime startTime={startTime} results={results} />
);
const Status = status => <JobStatus status={status} />;
const Stats = status => <NodeStats status={status} />;
const Priority = priority => <JobPriority priority={priority} />;

const Types = types => <JobTypes types={types} fullName={false} />;

const TitleFlex = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;

  height: 55px;
  border-bottom: 1px solid
    ${props => props.theme.Styles.TitleDataJob.titleBottom};
`;

const Item = styled.div`
  padding-left: 23px;
`;

const TitleDataJob = ({ job }) => (
  <TitleFlex>
    <Item>
      <b> {Name(job?.pipeline?.name)} </b>
    </Item>
    <Item>{Id(job?.key)}</Item>
    <Item> {StartTime(job?.pipeline?.startTime, job.results)}</Item>
    <Item> {Types(job?.pipeline?.types)}</Item>
    <Item>{Priority(job?.pipeline?.priority)}</Item>
    <Item> {Stats(job?.status)}</Item>
    <Item> {Status(job?.status)}</Item>
  </TitleFlex>
);

TitleDataJob.propTypes = {
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

export default React.memo(TitleDataJob);
