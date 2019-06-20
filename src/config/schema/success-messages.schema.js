const successMsg = payload => ({
  ALGORITHM_APPLY: 'Algorithm Applied',
  BUILD_RERUN: 'Build rerun started',
  BUILD_STOP: 'Build has stopped',
  CRON_START: 'Cron job started for selected pipeline',
  CRON_STOP: 'Cron job disabled for selected pipeline',
  DEBUG_ADD: 'Debug added',
  DEBUG_DELETE: 'Debug deleted',
  PIPELINE_ADD: `Pipeline ${payload.name} has been stored`,
  PIPELINE_DELETE: 'Pipeline deleted',
  PIPELINE_START: 'Pipeline started, check Jobs table',
  PIPELINE_UPDATE: 'Pipeline updated'
});

export default successMsg;
