import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Table, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import USER_GUIDE, { userGuideStepIndexes } from 'constants/user-guide';
import { jobsTableMock } from 'config/template/user-guide.template';
import Immutable from 'seamless-immutable';

const CustomExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const TableScrollHidden = styled(Table)`
  overflow: hidden;
`;

const mockDataSource = Immutable(jobsTableMock);

export default function DynamicTable(props) {
  const { dataSource, isInner, disablePagination } = props;
  const tableDataSource = dataSource || [];

  const { isOn: isGuideOn, stepIndex } = useSelector(state => state.userGuide);

  const guideProps = {
    className: USER_GUIDE.TABLE,
    expandedRowKeys:
      stepIndex >=
      userGuideStepIndexes.findIndex(
        step => step === USER_GUIDE.TABLE_JOB.MENU_SELECT
      )
        ? [mockDataSource[mockDataSource.length - 1].key]
        : []
  };

  const additionalProps = isGuideOn ? guideProps : {};

  const table = (
    <TableScrollHidden
      {...props}
      {...additionalProps}
      size="middle"
      expandIcon={CustomExpandIcon}
      dataSource={isGuideOn ? mockDataSource : tableDataSource}
      pagination={
        tableDataSource.length < 20 || isGuideOn ? false : { pageSize: 20 }
      }
    />
  );

  return isInner ? table : <Scrollbars autoHide>{table}</Scrollbars>;
}

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};
