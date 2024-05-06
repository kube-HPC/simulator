import React from 'react';
import { Route, Routes } from 'react-router';
import EditDrawer from './EditDrawer';
import DataSourcesGrid from './DataSourcesGrid';

const DataSourcesTables = () => (
  <>
    <DataSourcesGrid />
    <Routes>
      <Route
        path=":dataSourceId/:dataSourceName/:mode/snapshot/:snapshotName"
        element={<EditDrawer />}
      />
      <Route
        path=":dataSourceId/:dataSourceName/:mode"
        element={<EditDrawer />}
      />
    </Routes>
  </>
);

export default DataSourcesTables;
