import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import { useVersions } from 'hooks';
import getVersionsColumns from './getVersionsColumns.react';

const expandedRowRender = record => (
  <Card isMargin>
    <JsonSwitch obj={record} />
  </Card>
);

const rowKey = ({ algorithmImage }) => algorithmImage;

const VersionsTable = ({ algorithmName, currentVersion, isFetch }) => {
  const { dataSource, onApply, onDelete } = useVersions({
    algorithmName,
    isFetch,
  });
  const columns = getVersionsColumns({ currentVersion, onApply, onDelete });

  return (
    <Table
      rowKey={rowKey}
      loading={!dataSource}
      expandedRowRender={expandedRowRender}
      dataSource={dataSource}
      columns={columns}
    />
  );
};

VersionsTable.propTypes = {
  algorithmName: PropTypes.string.isRequired,
  currentVersion: PropTypes.string.isRequired,
  isFetch: PropTypes.bool.isRequired,
};

export default VersionsTable;
