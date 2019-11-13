import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import getVersionsColumns from './getVersionsColumns.react';
import { useDispatch } from 'react-redux';
import { getAlgorithmVersions } from 'actions/algorithm.action';
// import { STATE_SOURCES } from 'const';

// #region mock
const mock = [
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner-4',
    cpu: 1,
    mem: '1Gi',
    options: {
      debug: false,
      pending: false,
    },
    minHotWorkers: 0,
    type: 'Image',
  },
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner-3',
    cpu: 1,
    mem: '1Gi',
    options: {
      debug: false,
      pending: false,
    },
    minHotWorkers: 0,
    type: 'Image',
  },
  {
    name: 'eval-alg',
    algorithmImage: 'hkube/algorunner-2',
    cpu: 1,
    mem: '1Gi',
    options: {
      debug: false,
      pending: false,
    },
    minHotWorkers: 0,
    type: 'Image',
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
      pending: false,
    },
  },
];
// #endregion

const noop = () => {};

const VersionsTable = ({ algorithmName, currentVersion }) => {
  const columns = getVersionsColumns({ onDelete: noop, onVersionApply: noop, currentVersion });
  const dispatch = useDispatch();

  // const dataSource = useSelector(state => state[STATE_SOURCES.ALGORITHM_VERSIONS]);

  useEffect(() => {
    dispatch(getAlgorithmVersions(algorithmName));
  }, [dispatch, algorithmName]);

  return <Table expandIcon={undefined} dataSource={mock} columns={columns} />;
};

VersionsTable.propTypes = {
  algorithmName: PropTypes.string.isRequired,
  currentVersion: PropTypes.string.isRequired,
};

export default VersionsTable;
