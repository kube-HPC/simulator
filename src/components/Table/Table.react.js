import { Icon, Spin, Table as AntTable } from 'antd';
import { USER_GUIDE } from 'const';
import PropTypes from 'prop-types';
import React from 'react';
import Immutable from 'seamless-immutable';
import styled from 'styled-components';

const ExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const TableWhite = styled(AntTable)`
  .ant-table-thead > tr > th {
    background: none;
  }
  .ant-table-row {
    .${USER_GUIDE.TABLE_JOB.ACTIONS_SELECT} {
      transition: all 0.5s;
      opacity: 0;
      height: 32px;
      overflow: hidden;
      width: 0;
    }
    &:hover,
    &:focus {
      .${USER_GUIDE.TABLE_JOB.ACTIONS_SELECT} {
        opacity: 1;
        width: fit-content;
      }
    }
  }
`;

ExpandIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired,
};

const antIcon = <Icon type="loading" style={{ fontSize: 40 }} spin />;
Spin.setDefaultIndicator(antIcon);

const DEFAULT_PAGINATION = {
  defaultPageSize: 20,
  hideOnSinglePage: true,
  showLessItems: true,
};

const Table = ({ dataSource = [], ...props }) => {
  const tableSource = Immutable.isImmutable(dataSource) ? dataSource.asMutable() : dataSource;
  return (
    <TableWhite
      loading={!dataSource}
      className={USER_GUIDE.TABLE}
      expandIcon={ExpandIcon}
      // Cannot sort immutable entries.
      dataSource={tableSource}
      pagination={DEFAULT_PAGINATION}
      size="middle"
      {...props}
    />
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  ...AntTable.propTypes,
};

export default React.memo(Table);
