import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Table, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import USER_GUIDE from 'constants/user-guide';

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
  const tableDataSource = dataSource || [];

  const table = (
    <TableScrollHidden
      {...props}
      className={USER_GUIDE.TABLE}
      size="middle"
      expandIcon={CustomExpandIcon}
      // expandedRowKeys={[dataSource[dataSource.length - 1].key]}
      dataSource={tableDataSource}
      pagination={tableDataSource.length < 20 ? false : { pageSize: 20 }}
    />
  );

  return isInner ? table : <Scrollbars autoHide>{table}</Scrollbars>;
}

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};
