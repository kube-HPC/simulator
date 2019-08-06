import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Immutable from 'seamless-immutable';
import { useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

import { Table, Icon } from 'antd';
import USER_GUIDE, { userGuideStepIndexes } from 'constants/user-guide';
import { jobsTableMock } from 'config/template/user-guide.template';

const CustomExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const TableScrollHidden = styled(Table)`
  overflow: hidden;
`;

const mockDataSource = Immutable(jobsTableMock);

const DynamicTable = ({ dataSource, isInner, ...props }) => {
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

  const userGuideProps = isGuideOn ? guideProps : {};

  const table = (
    <TableScrollHidden
      {...userGuideProps}
      size="middle"
      expandIcon={CustomExpandIcon}
      dataSource={isGuideOn ? mockDataSource : tableDataSource}
      pagination={
        tableDataSource.length < 20 || isGuideOn ? false : { pageSize: 20 }
      }
      {...props}
    />
  );

  return isInner ? table : <Scrollbars autoHide>{table}</Scrollbars>;
};

export default DynamicTable;

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};
