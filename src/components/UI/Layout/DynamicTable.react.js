import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'antd';

const CustomExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

export default function DynamicTable({ isLoading, dataSource, ...props }) {
  return (
    <Table
      size="middle"
      expandIcon={CustomExpandIcon}
      dataSource={dataSource || []}
      pagination={
        dataSource && dataSource.length < 10
          ? false
          : {
              pageSize: 15,
              showSizeChanger: true,
              showQuickJumper: true,
              size: 'small',
              showLessItems: true,
              pageSizeOptions: ['10', '15', '20', '30', '40']
            }
      }
      {...props}
    />
  );
}

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.object,
  handleFetch: PropTypes.func,
  expandedRowRender: PropTypes.func
};
