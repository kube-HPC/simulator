import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Table, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const CustomExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const TableScrollHidden = styled(Table)`
  overflow: hidden;
`;

export default function DynamicTable({
  dataSource,
  isInner = false,
  ...props
}) {
  const table = (
    <TableScrollHidden
      {...props}
      size="middle"
      expandIcon={CustomExpandIcon}
      dataSource={dataSource || []}
      pagination={{ pageSize: 20 }}
    />
  );

  return isInner ? table : <Scrollbars autoHide>{table}</Scrollbars>;
}

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};
