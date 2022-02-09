import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Jobs from './Jobs';
import QueueOrderJobs from './Jobs/QueueOrderJobs';
import AlgorithmsTable from './Algorithms';
import DriversTable from './Drivers';
import PipelinesTable from './Pipelines';
import WorkersTable from './Workers';
import DataSources from './DataSources';

const Body = () => (
  <Switch>
    <Route exact path={['/jobs', '/jobs/:jobId?/*']} component={Jobs} />
    <Route
      exact
      path={['/queue', '/queue/:jobId?/*']}
      component={QueueOrderJobs}
    />
    <Route
      exact
      path={['/pipelines', '/pipelines/:pipelineId?/*']}
      component={PipelinesTable}
    />
    <Route
      exact
      path={['/algorithms', '/algorithms/:algorithmId?/*']}
      component={AlgorithmsTable}
    />
    <Route exact path="/workers/:empty?" component={WorkersTable} />
    <Route exact path="/drivers/:empty?" component={DriversTable} />
    <Route
      exact
      path={['/datasources', '/datasources/:datasourceId?/*']}
      component={DataSources}
    />
    <Redirect to="/jobs" replace />
  </Switch>
);

export default Body;
