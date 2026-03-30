import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import IDProvider from 'IDProvider';
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

    const onGridReady = params => {
      gridRef.current = params.api;
      setGridApi(params.api);
    };

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
        <ColumnsControl gridApi={gridApi} />
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
  enableRowHoverActions: PropTypes.bool,
  actionClassName: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default HKGrid;
