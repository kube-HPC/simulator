import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { Table as AntTable, Icon, Spin } from 'antd';
import { USER_GUIDE } from 'const';
import { setConnectionStatus } from 'actions/connection.action';

const ExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

ExpandIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired
};

const antIcon = <Icon type="loading" style={{ fontSize: 40 }} spin />;
Spin.setDefaultIndicator(antIcon);

const DEFAULT_PAGINATION = {
  defaultPageSize: 20,
  hideOnSinglePage: true,
  showLessItems: true
};

let isDispatchedOnce = false;

const Table = ({ dataSource, ...props }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isDispatchedOnce && dataSource) {
      isDispatchedOnce = true;
      dispatch(setConnectionStatus({ isDataAvailable: true }));
    }
  }, [dataSource, dispatch]);

  return (
    <AntTable
      loading={!dataSource}
      className={USER_GUIDE.TABLE}
      expandIcon={ExpandIcon}
      dataSource={dataSource}
      pagination={DEFAULT_PAGINATION}
      size="middle"
      {...props}
    />
  );
};

export default React.memo(Table);

Table.propTypes = {
  dataSource: PropTypes.array,
  ...AntTable.propTypes
};
