import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SettingOutlined } from '@ant-design/icons';
import { Dropdown, Checkbox, Button } from 'antd';
import { ActionChip, ColumnsControlWrapper } from './HKGrid.styles';

const getColumnsState = api =>
  api?.getAllGridColumns()?.map(col => ({
    field: col.getColDef().field,
    headerName: col.getColDef().headerName,
    visible: col.isVisible(),
    isPinning: col.getColDef().isPinning,
  })) || [];

const ColumnsControl = ({ gridApi }) => {
  const [columnsState, setColumnsState] = useState([]);

  useEffect(() => {
    if (!gridApi) return () => {};

    const syncColumnsState = () => {
      setColumnsState(getColumnsState(gridApi));
    };

    syncColumnsState();

    gridApi.addEventListener('columnVisible', syncColumnsState);
    gridApi.addEventListener('columnPinned', syncColumnsState);
    gridApi.addEventListener('newColumnsLoaded', syncColumnsState);
    gridApi.addEventListener('columnMoved', syncColumnsState);

    return () => {
      gridApi.removeEventListener('columnVisible', syncColumnsState);
      gridApi.removeEventListener('columnPinned', syncColumnsState);
      gridApi.removeEventListener('newColumnsLoaded', syncColumnsState);
      gridApi.removeEventListener('columnMoved', syncColumnsState);
    };
  }, [gridApi]);

  const toggleColumn = useCallback(
    field => {
      if (!gridApi) return;
      const column = gridApi.getColumn(field);
      gridApi.setColumnsVisible([field], !column?.isVisible());
    },
    [gridApi]
  );

  const resetColumns = useCallback(() => {
    if (!gridApi) return;
    gridApi.resetColumnState();
    setColumnsState(getColumnsState(gridApi));
  }, [gridApi]);

  const menuItems = useMemo(
    () => [
      ...columnsState
        .filter(col => col.headerName)
        .map(col => ({
          key: col.field,
          disabled: col.isPinning,
          label: (
            <Checkbox
              onClick={e => e.stopPropagation()}
              checked={col.visible}
              onChange={() => toggleColumn(col.field)}
              disabled={col.isPinning}
              style={col.isPinning ? { color: '#aaa' } : {}}>
              {col.headerName}
            </Checkbox>
          ),
        })),
      {
        key: 'reset',
        label: (
          <Button
            type="link"
            onClick={e => {
              e.stopPropagation();
              resetColumns();
            }}
            block>
            Reset Columns
          </Button>
        ),
      },
    ],
    [columnsState, resetColumns, toggleColumn]
  );

  if (!gridApi) return null;

  return (
    <ColumnsControlWrapper>
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <ActionChip>
          <SettingOutlined /> Columns
        </ActionChip>
      </Dropdown>
    </ColumnsControlWrapper>
  );
};

ColumnsControl.propTypes = {
  gridApi: PropTypes.object,
};

export default ColumnsControl;
