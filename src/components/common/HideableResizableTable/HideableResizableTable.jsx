import React, { useRef } from 'react';
import { Table, Dropdown, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { SettingOutlined, CloseOutlined } from '@ant-design/icons';
import ResizableTitle from './ResizableTitle';
import BodyCell from './BodyCell';
import { useTableState } from './useTableState';
import { GhostLine, TitleContainer, TitleButton } from './StyledComponents';

const HideableResizableTable = ({ tableId, columns, dataSource, ...rest }) => {
  const ghostLineRef = useRef(null);
  const containerRef = useRef(null);

  const {
    visibleColumns,
    colWidths,
    isChange,
    toggleColumn,
    updateColumnWidth,
    resetTable,
  } = useTableState(tableId, columns);

  const menuItems = columns.map(col => {
    const key = col.key || col.dataIndex;
    return {
      key,
      label: (
        <Checkbox
          checked={visibleColumns.includes(key)}
          disabled={col.must}
          onChange={() => {
            toggleColumn(key);
          }}>
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

          onResize: (_e, { size }) => updateColumnWidth(key, size.width),

          setGhostLine: (clientX, show) => {
            if (!ghostLineRef.current || !containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const relativeX = clientX - rect.left;

            if (show) {
              ghostLineRef.current.style.display = 'block';
              ghostLineRef.current.style.left = `${relativeX}px`;
            } else {
              ghostLineRef.current.style.display = 'none';
            }
          },
        }),

        title: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {col.title}
            {!col.must && (
              <CloseOutlined
                style={{
                  opacity: 0,
                  marginLeft: 6,
                  cursor: 'pointer',
                  transition: '0.2s',
                  fontSize: 12,
                }}
                onClick={e => {
                  e.stopPropagation();
                  toggleColumn(key);
                }}
                onMouseEnter={e => {
                  if (e.currentTarget && e.currentTarget.style) {
                    e.currentTarget.style.opacity = 1;
                  }
                }}
                onMouseLeave={e => {
                  if (e.currentTarget && e.currentTarget.style) {
                    e.currentTarget.style.opacity = 0;
                  }
                }}
              />
            )}
          </div>
        ),
      };
    });

  const titleWithSettings = (
    <TitleContainer>
      {isChange && <TitleButton onClick={resetTable}>Reset</TitleButton>}

      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <TitleButton>
          <SettingOutlined />
          &nbsp;Columns
        </TitleButton>
      </Dropdown>
    </TitleContainer>
  );

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Table
        {...rest}
        components={{
          header: { cell: ResizableTitle },
          body: { cell: BodyCell },
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        title={() => titleWithSettings}
        columns={enhancedColumns}
        dataSource={dataSource}
        pagination={false}
      />

      <GhostLine ref={ghostLineRef} />
    </div>
  );
};

HideableResizableTable.propTypes = {
  tableId: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
};

export default HideableResizableTable;
