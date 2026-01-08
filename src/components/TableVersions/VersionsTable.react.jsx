import React, { useMemo, useState } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
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
  onSaveAs,
  dataSource = undefined,
  source,
  setVersionsCompare,
}) => {
  const { keycloakEnable } = useSelector(selectors.connection);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = getVersionsColumns({
    currentVersion,
    onApply,
    onDelete,
    onSaveAs,
    source,
  });

  const columnsView = useMemo(() => {
    if (!keycloakEnable) {
      return columns.slice(1);
    }
    return columns;
  }, [columns, keycloakEnable]);

  const expandIcon = ({ expanded, onExpand, record }) =>
    expanded ? (
      <DownOutlined onClick={e => onExpand(record, e)} />
    ) : (
      <RightOutlined onClick={e => onExpand(record, e)} />
    );

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    if (newSelectedRowKeys.length > 2) return;

    setSelectedRowKeys(newSelectedRowKeys);
    const versions = selectedRows.map(row => row.version);
    setVersionsCompare(versions);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: record => ({
      disabled:
        selectedRowKeys.length >= 2 &&
        !selectedRowKeys.includes(record.version),
    }),
  };
  const onRow = record => {
    const isCurrentVersion = record.version === currentVersion;
    const isSelected = selectedRowKeys.includes(record.version);

    return {
      style: {
        backgroundColor: isCurrentVersion ? '#f0f5ff' : undefined,
        border: isSelected ? '2px solid #4b99ceff' : undefined,
      },
    };
  };
  return (
    <Table
      rowKey={rowKey}
      dataSource={dataSource || []}
      columns={columnsView || []}
      loading={!dataSource}
      rowSelection={rowSelection}
      onRow={onRow}
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
  onSaveAs: PropTypes.func.isRequired,
  dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  source: PropTypes.string.isRequired,
  setVersionsCompare: PropTypes.func.isRequired,
};

export default VersionsTable;
