import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import IDProvider from 'IDProvider';
import { useDispatch } from 'react-redux';
import { updatePreferenceLocal } from 'reducers/preferences.reducer';
import ColumnsControl from './ColumnsControl';
import BackToTopButton from './BackToTopButton';
import { LoadingOverlay, StyledGridWrapper } from './HKGrid.styles';

// Register community modules
ModuleRegistry.registerModules([AllCommunityModule]);

export const HKGrid = forwardRef(
  (
    {
      rowData,
      columnDefs,
      tableId,
      enableRowHoverActions = false,
      actionClassName,
      className,
      loading = false,
      ...props
    },
    ref
  ) => {
    const gridRef = useRef(null);
    const [gridApi, setGridApi] = useState(null);
    const dispatch = useDispatch();

    const onGridReady = params => {
      gridRef.current = params.api;
      setGridApi(params.api);
    };

    // Capture column visibility and width changes into preferences (local only)
    const handleColumnStateChanged = useCallback(() => {
      if (!gridApi || !tableId) return;
      const allCols = gridApi.getAllGridColumns();
      if (!allCols) return;
      const columns = {};
      allCols.forEach(col => {
        const def = col.getColDef();
        if (!def.field || def.isPinning) return;
        columns[def.field] = {
          visible: col.isVisible(),
          width: col.getActualWidth() || null,
        };
      });
      dispatch(
        updatePreferenceLocal({
          section: 'tables',
          value: { [tableId]: { columns } },
        })
      );
    }, [gridApi, tableId, dispatch]);

    useImperativeHandle(ref, () => ({
      refreshCells: (params = { force: true }) => {
        if (gridApi) {
          gridApi.refreshCells(params);
        }
      },
      getApi: () => gridApi,
    }));

    const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

    // Force refresh when rowData
    useEffect(() => {
      if (gridApi) {
        gridApi.refreshCells({ force: true });
      }
    }, [rowData, gridApi]);

    return (
      <>
        <ColumnsControl gridApi={gridApi} tableId={tableId} />
        <IDProvider dataTestId="hk-grid">
          <StyledGridWrapper
            className={className}
            $enableRowHoverActions={enableRowHoverActions}
            $actionClassName={actionClassName}>
            {loading && (
              <LoadingOverlay>
                <Spin indicator={antIcon} />
              </LoadingOverlay>
            )}

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
                showUnsortIcon
                onColumnVisible={handleColumnStateChanged}
                onColumnResized={handleColumnStateChanged}
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
        </IDProvider>
        <BackToTopButton gridApi={gridApi} rowData={rowData} />
      </>
    );
  }
);

HKGrid.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  tableId: PropTypes.string,
  enableRowHoverActions: PropTypes.bool,
  actionClassName: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default HKGrid;
