import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import { useVersions } from 'hooks';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import getVersionsColumns from './getVersionsColumns.react';

const expandedRowRender = record => (
  <Card isMargin>
    <JsonSwitch obj={record} />
  </Card>
);

const rowKey = ({ version }) => version;

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
      dataSource={dataSource}
      columns={columns}
      expandable={{
        expandedRowRender: record => expandedRowRender(record),
        // eslint-disable-next-line react/prop-types
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          ),
      }}
    />
  );
};

VersionsTable.propTypes = {
  algorithmName: PropTypes.string.isRequired,
  currentVersion: PropTypes.string.isRequired,
  isFetch: PropTypes.bool.isRequired,
};

export default VersionsTable;
