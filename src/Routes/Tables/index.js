import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { metaVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import Jobs from './Jobs';
import QueueOrderJobsV2 from './QueueOrderJobsV2';
import AlgorithmsTable from './Algorithms';
import DriversTable from './Drivers';
import PipelinesTable from './Pipelines';
import WorkersTable from './Workers';
import DataSources from './DataSources';

const Body = () => {
  const metaMode = useReactiveVar(metaVar);
  const { hash, search } = window.location;
  const { experimentName } = metaMode;
  console.log('!hash || (hash && !search)', !hash || (hash && !search));
  useEffect(() => {
    if (!hash || (hash && !search)) {
      window.location.replace(
        `${window.location.origin}${window.location.pathname}#/jobs?&experiment=${experimentName ?? 'main'}`
      );
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />

      <Route path="jobs" element={<Jobs />}>
        <Route path=":jobId/*" />
      </Route>

      <Route path="queue" element={<QueueOrderJobsV2 />}>
        <Route path=":edit/*" />
      </Route>

      <Route path="pipelines" element={<PipelinesTable />}>
        <Route path=":pipelineId/*" />
      </Route>

      <Route path="algorithms" element={<AlgorithmsTable />}>
        <Route path=":algorithmId/*" />
      </Route>

      <Route path="workers/*" element={<WorkersTable />} />
      <Route path="drivers/*" element={<DriversTable />} />

      <Route path="datasources" element={<DataSources />}>
        <Route path=":dataSourceId">
          <Route path=":dataSourceName/*" />
        </Route>
      </Route>
    </Routes>
  );
};

export default Body;
