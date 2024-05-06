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
  <>
    <Routes>
      <Route path="jobs" element={<Jobs />}>
        <Route path=":jobId/*" />
      </Route>

      <Route path="/" element={<Navigate to="/jobs" replace />} />
    </Routes>
    <Routes>
      <Route path="/queue" element={<QueueOrderJobsV2 />}>
        <Route path=":edit/*" />
      </Route>
    </Routes>

    <Routes>
      <Route path="/pipelines" element={<PipelinesTable />}>
        <Route path=":pipelineId/*" />
      </Route>
    </Routes>
    <Routes>
      <Route path="/algorithms" element={<AlgorithmsTable />}>
        <Route path=":algorithmId/*" />
      </Route>
    </Routes>
    <Routes>
      <Route path="/workers/*" element={<WorkersTable />} />
      <Route path="/drivers/*" element={<DriversTable />} />
    </Routes>
    <Routes>
      <Route path="/datasources" element={<DataSources />}>
        <Route path=":dataSourceId">
          <Route path=":dataSourceName/*" />
        </Route>
      </Route>
    </Routes>
  </>
);

export default Body;
