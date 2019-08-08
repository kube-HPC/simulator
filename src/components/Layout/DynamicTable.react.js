import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Immutable from 'seamless-immutable';
import { useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

import { Table, Icon } from 'antd';
import USER_GUIDE, { userGuideStepIndexes } from 'constants/user-guide';
import { jobsTableMock } from 'config/template/user-guide.template';

const expandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const TableScrollHidden = styled(Table)`
  overflow: hidden;
`;

const mockDataSource = Immutable.from(jobsTableMock);

const expendIndex = userGuideStepIndexes.findIndex(
  step => step === USER_GUIDE.TABLE_JOB.MENU_SELECT
);

const expandLast = expanded =>
  expanded ? [mockDataSource[mockDataSource.length - 1].key] : [];

const alwaysEqual = (a, b) => {
  return a.stepIndex !== expendIndex && a.isOn === b.isOn;
};

const DynamicTable = ({ dataSource, isInner, ...props }) => {
  const { isOn, stepIndex } = useSelector(
    state => state.userGuide,
    alwaysEqual
  );

  const tableDataSource = isOn ? mockDataSource : dataSource;
  const expanded = stepIndex >= expendIndex;
  const expandedRowKeys = isOn ? { expandedRowKeys: expandLast(expanded) } : {};
  const pagination = tableDataSource.length < 20 ? false : { pageSize: 20 };

  const table = (
    <TableScrollHidden
      {...props}
      {...expandedRowKeys}
      className={USER_GUIDE.TABLE}
      expandIcon={expandIcon}
      dataSource={tableDataSource}
      pagination={pagination}
      size="middle"
    />
  );

  return isInner ? table : <Scrollbars autoHide>{table}</Scrollbars>;
};

export default React.memo(DynamicTable);

// TableScrollHidden.whyDidYouRender = true;
// Table.whyDidYouRender = true;
// DynamicTable.whyDidYouRender = true;

DynamicTable.defaultProps = {
  isInner: false
};

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};
