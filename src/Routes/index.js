import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AlgorithmsTable,
  DebugTable,
  DriversTable,
  PipelinesTable,
  WorkersTable,
  JobsTable,
} from 'components/Tables';

const Routes = () => (
  <>
    {/* <h1>router root</h1> */}
    <Switch>
      <Route exact path="/debug-table" component={DebugTable} />
      <Route exact path="/drivers-table" component={DriversTable} />
      <Route exact path="/pipelines-table" component={PipelinesTable} />
      <Route exact path="/workers-table" component={WorkersTable} />
      <Route exact path="/algorithms-table" component={AlgorithmsTable} />
      <Route exact path="/" component={JobsTable} />
    </Switch>
  </>
);
export default Routes;
