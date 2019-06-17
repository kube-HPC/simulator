import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

export default function InfinityTable({ isLoading, dataSource, ...props }) {
  return (
    <Table
      key="InfinityTable"
      size="middle"
      dataSource={dataSource || []}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        size: 'small'
      }}
      {...props}
    />
  );
}

InfinityTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.object,
  handleFetch: PropTypes.func,
  expandedRowRender: PropTypes.func
};
