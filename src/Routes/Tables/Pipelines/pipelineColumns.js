/* eslint-disable react/destructuring-assignment */
import React from 'react';
// import { sorter } from 'utils';
import { Ellipsis } from 'components/common';
import AuditTrailAvatar from '../../../components/AuditTrailAvatar';
import PipelineActions from './PipelineActions.react';
import PipelineCron from './PipelineCron.react';
import PipelineStats from './PipelineStats.react';
import LastModified from './../Algorithms/LastModified';

/* ---------- Cell Renderers ---------- */

// params = { value, data, node, ... }

const AuditTrailCell = params => <AuditTrailAvatar auditTrail={params.value} />;
const LastModifiedCell = params => (
  <LastModified
    auditTrail={params.data.auditTrail}
    modified={params.data.modified}
  />
);

const PipelineNameCell = params => (
  <Ellipsis copyable text={params.value} length={50} />
);

const StatsCell = params => (
  <PipelineStats name={params.data.name} nodes={params.data.nodes} />
);

const CronCell = params => <PipelineCron pipeline={params.data} />;

const ActionsCell = params => <PipelineActions pipeline={params.data} />;

/* ---------- Sorters ---------- */

// const sortByName = (a, b) => sorter(a.name, b.name);
// const sortByLastModified = (a, b) => sorter(a.modified, b.modified);

const pipelineColumnDefs = [
  {
    headerName: '',
    field: 'auditTrail',
    width: 60,
    sortable: false,
    filter: false,
    cellRenderer: AuditTrailCell,
    suppressMenu: true,
  },
  {
    headerName: 'Pipeline Name',
    field: 'name',
    flex: 3,
    sortable: true,
    unSortIcon: true,
    // comparator: sortByName,
    cellRenderer: PipelineNameCell,
  },
  {
    headerName: 'Cron Job',
    field: 'triggers',
    flex: 1.5,
    sortable: false,
    cellRenderer: CronCell,
  },
  {
    headerName: 'Pipeline Stats',
    field: 'nodes',
    flex: 1,
    sortable: false,
    cellRenderer: StatsCell,
  },
  {
    headerName: 'Last Modified',
    field: 'modified',
    flex: 1,
    sortable: true,
    unSortIcon: true,
    // comparator: sortByLastModified,
    cellRenderer: LastModifiedCell,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    flex: 1,
    sortable: false,
    cellRenderer: ActionsCell,
    cellStyle: { textAlign: 'center' },
    suppressMenu: true,
    isPinning: true,
  },
];

export default pipelineColumnDefs;
