import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { executeActions as EXECUT_ACTIONS } from '@hkube/consts';
import { Ellipsis } from 'components/common';
import { USER_GUIDE } from 'const';
import { sorter } from 'utils/stringHelper';
import { Divider } from 'antd';
import UserAvatar from '../../../components/UserAvatar';
import JobActions from './JobActions';
import PipelineNameActions from './PipelineNameActions';
import NodeStats from './NodeStats';
import JobPriority from './JobPriority';
import JobProgress from './JobProgress';
import JobStatus from './JobStatus';
import JobTime from './JobTime';
import JobTypes from './JobTypes';
import JobTags from './JobTags';
import JobTimingSmartDots from './JobTimingSmartDots';

const Id = ({ value }) => (
  <Ellipsis
    className={USER_GUIDE.TABLE_JOB.ID_SELECT}
    copyable
    text={value || '---'}
  />
);

Id.propTypes = {
  value: PropTypes.string,
};

const Name = ({ data }) => <PipelineNameActions pipeline={data} />;

Name.propTypes = {
  data: PropTypes.object.isRequired,
};

const StartTime = ({ data }) => {
  const { pipeline, results } = data;
  const { startTime, activeTime, queueTimeSeconds } = pipeline;

  return (
    <JobTime
      startTime={startTime}
      activeTime={activeTime}
      queueTimeSeconds={queueTimeSeconds}
      results={results}
    />
  );
};

StartTime.propTypes = {
  data: PropTypes.shape({
    pipeline: PropTypes.shape({
      startTime: PropTypes.any,
      activeTime: PropTypes.any,
      queueTimeSeconds: PropTypes.any,
    }).isRequired,
    results: PropTypes.any,
  }).isRequired,
};

// New Timeline using JobTimingSmartDots
const Timeline = ({ data }) => <JobTimingSmartDots data={data} />;

Timeline.propTypes = {
  data: PropTypes.object.isRequired,
};

const Status = ({ data }) => {
  const { status, auditTrail } = data;

  return <JobStatus status={status} auditTrail={auditTrail} />;
};

Status.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.any,
    auditTrail: PropTypes.any,
  }).isRequired,
};

const Stats = ({ value }) => <NodeStats status={value} />;

Stats.propTypes = {
  value: PropTypes.any,
};

const Priority = ({ data }) => {
  const { pipeline } = data;
  const { priority } = pipeline;
  return <JobPriority priority={priority} />;
};

Priority.propTypes = {
  data: PropTypes.shape({
    pipeline: PropTypes.shape({
      priority: PropTypes.any,
    }).isRequired,
  }).isRequired,
};

const Types = ({ data }) => {
  const { pipeline } = data;
  const { types, tags } = pipeline;

  return (
    <div style={{ display: 'flex' }}>
      {types && types.length > 0 && (
        <JobTypes
          types={types}
          isMinimized={tags && tags.length > 0}
          fullName={false}
        />
      )}

      {tags && tags.length > 0 && (
        <>
          <Divider style={{ height: '24px' }} type="vertical" />
          <JobTags tags={tags} />
        </>
      )}
    </div>
  );
};

Types.propTypes = {
  data: PropTypes.shape({
    pipeline: PropTypes.shape({
      types: PropTypes.array,
      tags: PropTypes.array,
    }).isRequired,
  }).isRequired,
};

const ProgressContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const Progress = ({ data }) => {
  const { status, type, width } = data;
  return (
    <ProgressContainer>
      <JobProgress status={status} type={type} width={width} />
      <JobActions job={data} />
    </ProgressContainer>
  );
};

Progress.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.any,
    type: PropTypes.any,
    width: PropTypes.any,
  }).isRequired,
};

const Avatar = ({ value }) => {
  const username = value?.find(
    entry => entry?.action === EXECUT_ACTIONS.RUN
  )?.user;

  return (
    value && (
      <UserAvatar
        username={username}
        size={20}
        titleToolTip={`Started by ${username}`}
      />
    )
  );
};

Avatar.propTypes = {
  value: PropTypes.array,
};

export default [
  {
    headerName: '',
    field: 'auditTrail',
    minWidth: 60,
    flex: 0.2,
    filter: false,
    sortable: false,
    cellRenderer: Avatar,
    suppressMenu: true,
    cellClass: 'vertical-center-cell',
  },
  {
    headerName: 'External ID',
    field: 'externalId',
    flex: 1,
    sortable: true,
    unSortIcon: true,
    cellRenderer: Id,
    cellClass: 'vertical-center-cell',
  },
  {
    headerName: 'Job ID',
    field: 'key',
    flex: 1.1,
    sortable: false,
    unSortIcon: true,
    cellRenderer: Id,
    cellClass: 'vertical-center-cell',
  },
  {
    headerName: 'Pipeline Name',
    field: 'pipeline.name',
    minWidth: 120,
    flex: 1.3,
    sortable: false,
    unSortIcon: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: Name,
    isPinning: true,
    cellStyle: {
      paddingTop: '11px',
      paddingBottom: '11px',
    },
  },
  {
    headerName: 'Start Time',
    field: 'pipeline.startTime',
    flex: 1.4,
    sortable: true,
    unSortIcon: true,
    hide: true,
    comparator: (a, b) => a - b,
    cellRenderer: StartTime,
    cellClass: 'vertical-center-cell',
  },
  {
    headerName: 'Timeline',
    field: 'pipeline.activeTime',
    flex: 1.6,
    minWidth: 160,
    sortable: true,
    unSortIcon: true,
    comparator: (a, b) => a - b,
    cellRenderer: Timeline,
    cellClass: 'vertical-center-cell',
    cellStyle: {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
  {
    headerName: 'Pipeline Type/Tags',
    field: 'pipeline',
    flex: 1,
    sortable: false,
    cellRenderer: Types,
    cellClass: 'vertical-center-cell',
    headerClass: 'ag-header-cell-center',
  },
  {
    headerName: 'Priority',
    field: 'pipeline.priority',
    flex: 0.7,
    sortable: true,
    unSortIcon: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: Priority,
    cellStyle: { textAlign: 'center' },
    cellClass: 'vertical-center-cell',
    headerClass: 'ag-header-cell-center',
  },
  {
    headerName: 'Nodes Stats',
    field: 'status',
    flex: 0.7,
    sortable: false,
    cellRenderer: Stats,
    cellStyle: { textAlign: 'center' },
    cellClass: 'vertical-center-cell',
    headerClass: 'ag-header-cell-center',
  },
  {
    headerName: 'Status',
    field: 'status.status',
    flex: 0.7,
    sortable: true,
    unSortIcon: true,
    comparator: (a, b) => sorter(a, b),
    cellRenderer: Status,
    isPinning: true,
    cellStyle: { textAlign: 'center' },
    cellClass: 'vertical-center-cell',
    headerClass: 'ag-header-cell-center',
  },
  {
    headerName: 'Progress',
    field: 'progress',
    minWidth: 150,
    flex: 2.5,
    sortable: false,
    cellRenderer: Progress,
    isPinning: true,
    cellStyle: {
      textAlign: 'center',
      paddingTop: '11px',
      paddingBottom: '11px',
    },
    suppressMenu: true,
    headerClass: 'ag-header-cell-center',
  },
];
