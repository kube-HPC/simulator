import React from 'react';
import { Route } from 'react-router';
import EditDrawer from './EditDrawer';
import DataSourcesGrid from './DataSourcesGrid';

const DataSourcesTables = () => (
  <>
    <DataSourcesGrid />
    <Route path="/datasources/:dataSourceId/edit" component={EditDrawer} />
  </>
);

export default DataSourcesTables;
