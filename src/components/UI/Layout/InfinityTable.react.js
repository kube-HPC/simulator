import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'antd';

const CustomExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

export default function InfinityTable({ isLoading, dataSource, ...props }) {
  return (
    <Table
      key="InfinityTable"
      size="middle"
      expandIcon={CustomExpandIcon}
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
