import React from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import { JsonSwitch, Card } from 'components/common';
import { Table } from 'components';

import getVersionsColumns from './getVersionsColumns.react';

const expandedRowRender = record => (
  <Card isMargin>
    <JsonSwitch obj={record} />
  </Card>
);

const rowKey = ({ version }) => version;

const VersionsTable = ({
  currentVersion,
  onApply,
  onDelete,
  dataSource = undefined,
  source,
}) => {
  const columns = getVersionsColumns({
    currentVersion,
    onApply,
    onDelete,
    source,
  });
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
  source: PropTypes.string.isRequired,
};

export default VersionsTable;
