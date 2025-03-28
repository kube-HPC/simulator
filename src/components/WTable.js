import React from 'react';
import PropTypes from 'prop-types';
import Icon, {
  DownOutlined,
  RightOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Spin, Table as AntTable } from 'antd';
import styled from 'styled-components';

import { USER_GUIDE } from 'const';

const ExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon
    type={expanded ? <DownOutlined /> : <RightOutlined />}
    onClick={e => onExpand(record, e)}
  />
);

const { TABLE_JOB } = USER_GUIDE;

const TableWhite = styled(AntTable)`
  .ant-table-thead > tr > th {
    background: none;
  }
  .ant-table-row {
    transition: all 2s ease;
    .${TABLE_JOB.ACTIONS_SELECT} {
      transition: all 2s ease;
      height: 32px;
      overflow: hidden;
      opacity: 0;
      width: 0;
    }
    &:hover {
      transition: all 0.1s ease;
      .${TABLE_JOB.ACTIONS_SELECT} {
        transition: all 0.1s ease;
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

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
Spin.setDefaultIndicator(antIcon);

const WTable = ({ dataSource = [], loading = false, ...props }) => (
  <TableWhite
    loading={loading || !dataSource}
    className={USER_GUIDE.TABLE}
    expandIcon={ExpandIcon}
    dataSource={dataSource}
    pagination={false}
    size="middle"
    {...props}
  />
);

WTable.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object.isRequired),
  loading: PropTypes.bool,
  ...AntTable.propTypes,
};

export default React.memo(WTable);
