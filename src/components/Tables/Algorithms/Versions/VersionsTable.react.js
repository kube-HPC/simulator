import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import getVersionsColumns from './getVersionsColumns.react';

// #region mock
const mock = [
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner-4',
    cpu: 1,
    mem: '1Gi',
    options: {
      debug: false,
      pending: false
    },
    minHotWorkers: 0,
    type: 'Image'
  },
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner-3',
    cpu: 1,
    mem: '1Gi',
    options: {
      debug: false,
      pending: false
    },
    minHotWorkers: 0,
    type: 'Image'
  },
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner-2',
    cpu: 1,
    mem: '1Gi',
    options: {
      debug: false,
      pending: false
    },
    minHotWorkers: 0,
    type: 'Image'
  },
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner',
    cpu: 1.5,
    mem: '50Mi',
    type: 'Image',
    minHotWorkers: 0,
    options: {
      debug: false,
      pending: false
    }
  }
];
// #endregion

const noop = () => {};

const VersionsTable = ({ currentVersion = 'hkube/algorunner' }) => {
  const columns = getVersionsColumns({ onDelete: noop, onVersionApply: noop, currentVersion });
  return <Table expandIcon={undefined} dataSource={mock} columns={columns} />;
};

VersionsTable.propTypes = {
  currentVersion: PropTypes.string.isRequired
};

export default VersionsTable;
