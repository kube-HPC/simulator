import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InfinityTable as Table } from 'antd-table-infinity';
import { Spin } from 'antd';

import { HCOLOR } from 'constants/colors';

const StyledSpin = styled(Spin)`
  text-align: center;
  padding-top: 40;
  padding-bottom: 40;
  border: 1px solid ${HCOLOR.colorAccent};
`;

export default function InfinityTable({ isLoading, dataSource, ...props }) {
  const tableSize = (dataSource && dataSource.length) || 0;
  return (
    <Table
      key="InfinityTable"
      loadingIndicator={<StyledSpin tip="Loading..." />}
      scroll={{ y: tableSize > 10 ? '88vh' : false }}
      size="middle"
      dataSource={dataSource || []}
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
