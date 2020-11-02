import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon, Spin, Table as AntTable } from 'antd';
import styled from 'styled-components';
import Immutable from 'seamless-immutable';
import { USER_GUIDE } from 'const';

const ExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon type={expanded ? 'down' : 'right'} onClick={e => onExpand(record, e)} />
);

const { TABLE_JOB } = USER_GUIDE;

const TableWhite = styled(AntTable)`
  .ant-table-thead > tr > th {
    background: none;
  }
  .ant-table-row {
    transition: all 1s ease;
    .${TABLE_JOB.ACTIONS_SELECT} {
      transition: all 1s ease;
      height: 32px;
      overflow: hidden;
      opacity: 0;
      width: 0;
    }
    &:hover {
      transition: all 1s ease;
      .${TABLE_JOB.ACTIONS_SELECT} {
        transition: all 1s ease;
        opacity: 1;
        width: fit-content;
      }
    }
  }
`;

ExpandIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

const antIcon = <Icon type="loading" style={{ fontSize: 40 }} spin />;
Spin.setDefaultIndicator(antIcon);

const Table = ({ dataSource, loading, ...props }) => {
  const tableSource = useMemo(
    () =>
      Immutable.isImmutable(dataSource) ? dataSource.asMutable() : dataSource,
    [dataSource]
  );

  return (
    <TableWhite
      loading={loading || !dataSource}
      className={USER_GUIDE.TABLE}
      expandIcon={ExpandIcon}
      // Cannot sort immutable entries.
      dataSource={tableSource}
      pagination={false}
      size="middle"
      // eslint-disable-next-line
      {...props}
    />
  );
};

Table.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  ...AntTable.propTypes,
};
Table.defaultProps = {
  dataSource: [],
  loading: false,
};

export default React.memo(Table);