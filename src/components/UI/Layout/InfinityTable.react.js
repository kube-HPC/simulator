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

export default function InfinityTable({ isLoading, ...props }) {
  return (
    <Table
      key="InfinityTable"
      loadingIndicator={<StyledSpin tip="Loading..." />}
      scroll={{ y: '88vh' }}
      size="middle"
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
