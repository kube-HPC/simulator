import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import getVersionsColumns from './getVersionsColumns.react';
import { useDispatch, useSelector } from 'react-redux';
import { getAlgorithmVersions, deleteAlgorithmVersion, applyAlgorithmVersion } from 'actions/versions.action';
import { STATE_SOURCES } from 'const';



const VersionsTable = ({ algorithmName, currentVersion }) => {
  const dispatch = useDispatch();
  const onDelete = data => dispatch(deleteAlgorithmVersion(data));
  const onVersionApply = data => dispatch(applyAlgorithmVersion(data));
  const columns = getVersionsColumns({ onDelete, onVersionApply, currentVersion });
  const dataSource = useSelector(state => state[STATE_SOURCES.ALGORITHM_VERSIONS].dataSource);

  useEffect(() => {
    dispatch(getAlgorithmVersions(algorithmName));
  }, [dispatch, algorithmName]);

  return <Table expandIcon={undefined} dataSource={dataSource || []} columns={columns} />;
};

VersionsTable.propTypes = {
  algorithmName: PropTypes.string.isRequired,
  currentVersion: PropTypes.string.isRequired,
};

export default VersionsTable;
