import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Table as AntTable, Dropdown, Checkbox } from 'antd';
import {
  SettingOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { USER_GUIDE } from 'const';
import { useVT } from 'virtualizedtableforantd4';
import ResizableTitle from './ResizableTitle';
import { useTableState } from './useTableState';
import ExpandIcon from './ExpandIcon';

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

const ActionChip = styled.div`
  height: 7px;
  padding: 7px;
  font-size: 10px;
  line-height: 0.6;
  background: #e7e7e7;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
`;

const HideableResizableTable = ({
  tableId,
  columns,
  dataSource,
  loading = false,
  isInfinity = false,
  heightScroll = '88vh',
  ...props
}) => {
  const {
    visibleColumns,
    colWidths,
    isChange,
    toggleColumn,
    updateColumnWidth,
    resetTable,
  } = useTableState(tableId, columns);

  const [vt] = useVT(
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
  );

  const menuItems = columns.map(col => {
    const key = col.key || col.dataIndex;
    return {
      key,
      label: (
        <Checkbox
          checked={visibleColumns.includes(key)}
          disabled={col.must}
          onChange={() => toggleColumn(key)}>
          {col.title}
        </Checkbox>
      ),
    };
  });

  const enhancedColumns = columns
    .filter(col => visibleColumns.includes(col.key || col.dataIndex))
    .map(col => {
      const key = col.key || col.dataIndex;
      return {
        ...col,
        width: colWidths[key] || col.width || 'auto',
        onHeaderCell: () => ({
          width: colWidths[key] || col.width || 150,
          'data-key': key,
          onResize: (_e, { size }) => {
            updateColumnWidth(key, size.width);
          },
          onDoubleClick: () => {
            updateColumnWidth(key, col.width || 150);
          },
        }),
        title: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}>
            {col.title}
            {!col.must && (
              <CloseOutlined
                className="hide-icon"
                style={{
                  opacity: 0,
                  cursor: 'pointer',
                  marginLeft: 6,
                  transition: '0.2s',
                  fontSize: 12,
                }}
                onClick={e => {
                  e.stopPropagation();
                  toggleColumn(key);
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = 1;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = 0;
                }}
              />
            )}
          </div>
        ),
      };
    });

  const titleWithSettings = (
    <div style={{ position: 'absolute', zIndex: 1000, right: 10 }}>
      <div style={{ display: 'flex', gap: '12px', padding: '5px' }}>
        {isChange && <ActionChip onClick={resetTable}>Reset</ActionChip>}

        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <ActionChip>
            <SettingOutlined /> Columns
          </ActionChip>
        </Dropdown>
      </div>
    </div>
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  Spin.setDefaultIndicator(antIcon);

  const mergedComponents = {
    ...(isInfinity ? vt : {}),
    header: {
      ...(isInfinity && vt.header ? vt.header : {}),
      cell: ResizableTitle,
    },
  };

  return (
    <TableWhite
      {...props}
      components={mergedComponents}
      title={titleWithSettings}
      columns={enhancedColumns}
      dataSource={dataSource}
      expandIcon={ExpandIcon}
      loading={loading}
      scroll={isInfinity ? { y: heightScroll } : {}}
      // scroll={{ y: 'calc(80vh - 4em)' }}
      className={USER_GUIDE.TABLE}
      pagination={false}
      size="middle"
    />
  );
};

HideableResizableTable.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  isInfinity: PropTypes.bool,
  heightScroll: PropTypes.string,
  ...AntTable.propTypes,
};

export default HideableResizableTable;
