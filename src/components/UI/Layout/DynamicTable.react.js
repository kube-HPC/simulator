import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Table, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const CustomExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const NoScrollTable = styled(Table)`
  overflow: hidden;
`;

// TODO: Make infinity table
export default function DynamicTable({ isLoading, dataSource, ...props }) {
  return (
    <Scrollbars autoHide>
      <NoScrollTable
        size="middle"
        expandIcon={CustomExpandIcon}
        dataSource={dataSource || []}
        pagination={false}
        {...props}
      />
    </Scrollbars>
  );
}

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.object,
  handleFetch: PropTypes.func,
  expandedRowRender: PropTypes.func
};
