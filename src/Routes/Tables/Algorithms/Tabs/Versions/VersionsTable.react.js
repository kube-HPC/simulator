import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import getVersionsColumns from './getVersionsColumns.react';

const expandedRowRender = record => (
  <Card isMargin>
    <JsonSwitch obj={record} />
  </Card>
);

const rowKey = ({ version }) => version;

const VersionsTable = ({ currentVersion, onApply, onDelete, dataSource }) => {
  const columns = getVersionsColumns({ currentVersion, onApply, onDelete });
  const expandIcon = ({ expanded, onExpand, record }) =>
    expanded ? (
      <DownOutlined onClick={e => onExpand(record, e)} />
    ) : (
      <RightOutlined onClick={e => onExpand(record, e)} />
    );
  return (
    <Table
      rowKey={rowKey}
      loading={!dataSource}
      dataSource={dataSource}
      columns={columns}
      expandable={{
        expandedRowRender: record => expandedRowRender(record),
        expandIcon,
      }}
    />
  );
};

VersionsTable.propTypes = {
  currentVersion: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

VersionsTable.defaultProps = {
  dataSource: undefined,
};

export default VersionsTable;
