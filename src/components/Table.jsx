import React from 'react';

import PropTypes from 'prop-types';
import Icon, {
  DownOutlined,
  RightOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Spin, Table as AntTable } from 'antd';
import styled from 'styled-components';
// import { useVT } from 'virtualizedtableforantd4';

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
    transition: all 1s ease;
    .${TABLE_JOB.ACTIONS_SELECT} {
      transition: all 1s ease;
      height: 40px; //  height: 32px;
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

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
Spin.setDefaultIndicator(antIcon);

const Table = ({
  dataSource = [],
  loading = false,
  isInfinity = false,
  heightScroll = '88vh',
  ...props
}) => (
  /* const [vt] = useVT(
    () => ({
      initTop: 1,
      onScroll: ({ isEnd }) => {
        if (isEnd) {
          props.fetchMore();
        }
      },
      scroll: { y: heightScroll },
      //  debug: true,
    }),
    [dataSource]
  ); */

  <TableWhite
    loading={loading}
    //  components={isInfinity ? vt : null}
    scroll={isInfinity ? { y: heightScroll } : {}}
    // scroll={{ y: 'calc(80vh - 4em)' }}
    className={USER_GUIDE.TABLE}
    expandIcon={ExpandIcon}
    dataSource={dataSource}
    pagination={false}
    size="middle"
    {...props}
  />
);
Table.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  isInfinity: PropTypes.bool,
  heightScroll: PropTypes.string,
  ...AntTable.propTypes,
};

export default React.memo(Table);
