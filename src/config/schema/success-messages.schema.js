import Text from 'antd/lib/typography/Text';
import React from 'react';

const successMsg = payload => ({
  ALGORITHM_APPLY: 'Algorithm Applied, check Algorithms table',
  ALGORITHM_RUN: (
    <>
      Algorithm <Text code>{payload.body && payload.body.name}</Text> started, check{' '}
      <Text strong>Jobs</Text> table.
    </>
  ),
  BUILD_RERUN: 'Build rerun started',
  BUILD_STOP: 'Build has stopped',
  CRON_START: 'Cron job started for selected pipeline',
  CRON_STOP: 'Cron job disabled for selected pipeline',
  DEBUG_ADD: 'Debug added',
  DEBUG_DELETE: 'Debug deleted',
  JOBS_EXEC_CACHING: `Jobs Caching Execution Succeed, executing job with ID=${payload.jobId}`,
  PIPELINE_ADD: (
    <>
      Pipeline <Text code>{payload.name}</Text> has been stored
    </>
  ),
  PIPELINE_DELETE: 'Pipeline deleted',
  PIPELINE_START: 'Pipeline started, check Jobs table',
  PIPELINE_UPDATE: 'Pipeline updated',
  TENSORFLOW_START: 'Board started successfully',
  EXPERIMENT_ADD: (
    <>
      Experiment <Text code>{payload.name}</Text> has been stored
    </>
  ),
  EXPERIMENT_DELETE: (
    <>
      Experiment <Text code>{payload.name}</Text> has been removed
    </>
  ),
});

export default successMsg;
