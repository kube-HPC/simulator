import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]);

export const HKGrid = ({ rowData, columnDefs, ...props }) => (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        suppressCellFocus
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={false}
        defaultColDef={{
          sortable: true,
          // filter: true,
          resizable: true,
          suppressMovable: true,
        }}
        {...props}
      />
    </div>
  );

HKGrid.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
};

export default HKGrid;
