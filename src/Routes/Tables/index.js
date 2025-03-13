import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Jobs from './Jobs';
import QueueOrderJobsV2 from './QueueOrderJobsV2';
import AlgorithmsTable from './Algorithms';
import DriversTable from './Drivers';
import PipelinesTable from './Pipelines';
import WorkersTable from './Workers';
import DataSources from './DataSources';

const Body = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/jobs" replace />} />

    <Route path="/jobs" element={<Jobs />} />
    <Route path="/jobs/:jobId/*" element={<Jobs />} />

    <Route path="/queue" element={<QueueOrderJobsV2 />} />
    <Route path="/queue/:edit/*" element={<QueueOrderJobsV2 />} />

    <Route path="/pipelines" element={<PipelinesTable />} />
    <Route path="/pipelines/:pipelineId/*" element={<PipelinesTable />} />

    <Route path="/algorithms" element={<AlgorithmsTable />} />
    <Route path="/algorithms/:algorithmId/*" element={<AlgorithmsTable />} />

    <Route path="/workers/*" element={<WorkersTable />} />
    <Route path="/drivers/*" element={<DriversTable />} />

    <Route path="/datasources" element={<DataSources />} />
    <Route
      path="/datasources/:dataSourceId/:dataSourceName/*"
      element={<DataSources />}
    />
  </Routes>
);

export default Body;
