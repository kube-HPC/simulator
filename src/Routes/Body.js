import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  AlgorithmsTable,
  DebugTable,
  DriversTable,
  PipelinesTable,
  WorkersTable,
} from 'components/Tables';
import Jobs from 'components/Tables/Jobs';

const Body = () => (
  <Switch>
    <Route exact path="/debug" component={DebugTable} />
    <Route exact path="/drivers" component={DriversTable} />
    <Route exact path="/pipelines" component={PipelinesTable} />
    <Route exact path="/workers" component={WorkersTable} />
    <Route exact path="/algorithms" component={AlgorithmsTable} />
    <Route exact path="/jobs" component={Jobs} />
    <Redirect to="/jobs" replace />
  </Switch>
);

export default Body;
