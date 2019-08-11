import React from 'react';
import PropTypes from 'prop-types';

import { Table, Icon } from 'antd';
import USER_GUIDE from 'constants/user-guide';

const expandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGINATION = { pageSize: DEFAULT_PAGE_SIZE };

const DynamicTable = ({ dataSource, isInner, ...props }) => {
  return (
    <Table
      className={USER_GUIDE.TABLE}
      expandIcon={expandIcon}
      dataSource={dataSource}
      pagination={DEFAULT_PAGINATION}
      size="middle"
      hideOnSinglePage
      showLessItems
      {...props}
    />
  );
};

export default React.memo(DynamicTable);

DynamicTable.defaultProps = {
  isInner: false
};

DynamicTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};
