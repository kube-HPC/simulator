import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { SettingOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Checkbox, Button } from 'antd';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import styled from 'styled-components';

// Register community modules
ModuleRegistry.registerModules([AllCommunityModule]);

const ActionChip = styled.div`
  padding: 4px;
  font-size: 10px;
  // line-height: 0.6;
  background: #e7e7e7;
  border-radius: 6px;
  cursor: pointer;
  // user-select: none;
  // font-weight: bold;
`;

export const HKGrid = ({ rowData, columnDefs, ...props }) => {
  const gridRef = useRef(null);

  const [columnsState, setColumnsState] = useState([]);

  const onGridReady = params => {
    gridRef.current = params.api;

    const currentColumns =
      gridRef.current.getAllGridColumns()?.map(col => ({
        field: col.getColDef().field,
        headerName: col.getColDef().headerName,
        visible: col.isVisible(),
        isPinning: col.getColDef().isPinning,
      })) || [];

    setColumnsState(currentColumns);
  };

  const toggleColumn = field => {
    if (!gridRef.current) return;

    const colApi = gridRef.current;
    const col = colApi.getColumn(field);

    colApi.setColumnsVisible([field], !col.visible);

    setColumnsState(cols =>
      cols.map(c => (c.field === field ? { ...c, visible: !c.visible } : c))
    );
  };

  const resetColumns = () => {
    if (!gridRef.current) return;

    gridRef.current.resetColumnState();

    const resetState = gridRef.current.getAllGridColumns().map(col => ({
      field: col.getColDef().field,
      headerName: col.getColDef().headerName,
      visible: col.isVisible(),
      isPinning: col.getColDef().isPinning,
    }));

    setColumnsState(resetState);
  };

  const menu = (
    <Menu>
      {columnsState.map(col => (
        <Menu.Item key={col.field}>
          <Checkbox
            onClick={e => e.stopPropagation()}
            checked={col.visible}
            onChange={() => toggleColumn(col.field)}
            disabled={col.isPinning}
            style={col.isPinning ? { color: '#aaa' } : {}}>
            {col.headerName}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Item key="reset">
        <Button type="link" onClick={resetColumns} block>
          Reset Columns
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div
        style={{
          width: '65px',
          position: 'absolute',
          right: '30px',
          zIndex: 100,
          marginTop: '4px',
        }}>
        <Dropdown overlay={menu} trigger={['click']}>
          <ActionChip>
            <SettingOutlined /> Columns
          </ActionChip>
        </Dropdown>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={columnDefs}
          suppressCellFocus
          animateRows={false}
          defaultColDef={{
            sortable: true,
            resizable: true,
            suppressMovable: true,
          }}
          {...props}
        />
      </div>
    </>
  );
};

HKGrid.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
};

export default HKGrid;
