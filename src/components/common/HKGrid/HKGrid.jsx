import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { SettingOutlined, LoadingOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Checkbox, Button, Spin } from 'antd';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import styled from 'styled-components';

// Register community modules
ModuleRegistry.registerModules([AllCommunityModule]);

const ActionChip = styled.div`
  padding: 4px;
  font-size: 10px;
  background: ${props => props.theme.Styles.HKGrid.ActionChip || '#e7e7e7'};
  border-radius: 6px;
  cursor: pointer;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${props => props.theme.Styles.HKGrid.LoadingOverlay || 'rgba(255, 255, 255, 0.8)'};
  z-index: 10;
`;

const StyledGridWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  ${props =>
    props.$enableRowHoverActions &&
    `
    .ag-header-cell { background: none !important; }
    .ag-row {
      transition: all 0.3s ease;
      .${props.$actionClassName || 'ag-row-actions'} {
        transition: opacity 0.2s ease, width 0.2s ease;
        height: 32px;
        overflow: hidden;
        opacity: 0;
        width: 0;
      }
      &:hover {
        .${props.$actionClassName || 'ag-row-actions'} {
          transition: opacity 0.1s ease, width 0.1s ease;
          opacity: 1;
          width: fit-content;
        }
      }
    }
    .ag-row:hover { background-color: rgba(0,0,0,0.02); }
  `}

  .ag-root-wrapper { width: 100%; height: 100%; }
  .ag-header-cell-center .ag-header-cell-label { justify-content: center; }
  .ag-cell-value { white-space: nowrap !important; overflow: hidden !important; text-overflow: clip !important; }
`;

export const HKGrid = forwardRef(({
  rowData,
  columnDefs,
  enableRowHoverActions = false,
  actionClassName,
  className,
  loading = false,
  ...props
}, ref) => {
  const gridRef = useRef(null);
  const [columnsState, setColumnsState] = useState([]);
  const [gridApi, setGridApi] = useState(null); 

  const onGridReady = params => {
    gridRef.current = params.api;
    setGridApi(params.api); 

    const currentColumns = params.api.getAllGridColumns()?.map(col => ({
      field: col.getColDef().field,
      headerName: col.getColDef().headerName,
      visible: col.isVisible(),
      isPinning: col.getColDef().isPinning,
    })) || [];

    setColumnsState(currentColumns);
  };

  useImperativeHandle(ref, () => ({
    refreshCells: (params = { force: true }) => {
      if (gridApi) {
        gridApi.refreshCells(params);
      }
    },
    getApi: () => gridApi,
  }));

  const toggleColumn = field => {
    if (!gridApi) return;
    const col = gridApi.getColumn(field);
    gridApi.setColumnsVisible([field], !col.visible);
    setColumnsState(cols => cols.map(c => c.field === field ? { ...c, visible: !c.visible } : c));
  };

  const resetColumns = () => {
    if (!gridApi) return;
    gridApi.resetColumnState();
    const resetState = gridApi.getAllGridColumns().map(col => ({
      field: col.getColDef().field,
      headerName: col.getColDef().headerName,
      visible: col.isVisible(),
      isPinning: col.getColDef().isPinning,
    }));
    setColumnsState(resetState);
  };

  const menu = (
    <Menu>
      {columnsState.map(
        col =>
          col.headerName && (
            <Menu.Item key={col.field}>
              <Checkbox
                onClick={e => e.stopPropagation()}
                checked={col.visible}
                onChange={() => toggleColumn(col.field)}
                disabled={col.isPinning}
                style={col.isPinning ? { color: '#aaa' } : {}}
              >
                {col.headerName}
              </Checkbox>
            </Menu.Item>
          )
      )}
      <Menu.Item key="reset">
        <Button type="link" onClick={resetColumns} block>
          Reset Columns
        </Button>
      </Menu.Item>
    </Menu>
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  // Force refresh when rowData 
  useEffect(() => {
    if (gridApi) {
      gridApi.refreshCells({ force: true });
    }
  }, [rowData, gridApi]);

  return (
    <>
      <div style={{ width: '65px', position: 'absolute', right: '30px', zIndex: 100, marginTop: '4px' }}>
        <Dropdown overlay={menu} trigger={['click']}>
          <ActionChip><SettingOutlined /> Columns</ActionChip>
        </Dropdown>
      </div>

      <StyledGridWrapper
        className={className}
        $enableRowHoverActions={enableRowHoverActions}
        $actionClassName={actionClassName}
      >
        {loading && (
          <LoadingOverlay>
            <Spin indicator={antIcon} />
          </LoadingOverlay>
        )}

        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={rowData}
            columnDefs={columnDefs}
            suppressCellFocus
            animateRows={false}
            showUnsortIcon
            defaultColDef={{
              sortable: true,
              resizable: true,
              suppressMovable: true,
              headerClass: 'break-header',
            }}
            {...props}
          />
        </div>
      </StyledGridWrapper>
    </>
  );
});

HKGrid.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  enableRowHoverActions: PropTypes.bool,
  actionClassName: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default HKGrid;