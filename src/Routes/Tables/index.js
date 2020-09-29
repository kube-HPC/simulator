import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Jobs from './Jobs';
import AlgorithmsTable from './Algorithms';
import DebugTable from './Debug';
import DriversTable from './Drivers';
import PipelinesTable from './Pipelines';
import WorkersTable from './Workers';

const Body = () => (
  <Switch>
    <Route exact path="/debug" component={DebugTable} />
    <Route exact path="/drivers" component={DriversTable} />
    <Route exact path="/pipelines/:pipelineId?" component={PipelinesTable} />
    <Route exact path="/workers" component={WorkersTable} />
    <Route exact path="/algorithms/:algorithmId?" component={AlgorithmsTable} />
    <Route exact path="/jobs/:jobId?" component={Jobs} />
    <Redirect to="/jobs" replace />
  </Switch>
);

export default Body;
