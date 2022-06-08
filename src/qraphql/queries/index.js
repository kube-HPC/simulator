export { default as JOB_QUERY } from './job-query';
export { default as PIPELINE_QUERY } from './pipeline-query';
export { default as PIPELINE_STATS_QUERY } from './pipeline-stats-query';
export { default as ALGORITHMS_QUERY } from './algorithms-query';
export { default as ALGORITHM_AND_PIPELINE_NAMES } from './algorithm-pipeline-names';
export { default as JOB_BY_ID_QUERY } from './job-by-id-query';
export { default as ALGORITHM_BY_NAME_QUERY } from './algorithm-by-name-query';
export { default as DISCOVERY_QUERY } from './discovery-query';
export { default as WORKERS_ALL_QUERY } from './Workers/workers-query';
export { default as DRIVERS_ALL_QUERY } from './Drivers/drivers-query';
export { default as LOGS_QUERY } from './logs-query';

export { default as MANAGED_LIST } from './QueueOrderJobs/managed-list-query';
export { default as MANAGED_LIST_TAGS } from './QueueOrderJobs/managed-list-tags-query';
export { default as MANAGED_LIST_PIPELINE } from './QueueOrderJobs/managed-list-pipeline-query';

export { default as PREFERRED_LIST } from './QueueOrderJobs/preferred-list-query';
export { default as PREFERRED_LIST_TAGS } from './QueueOrderJobs/preferred-list-tags-query';
export { default as PREFERRED_LIST_PIPELINE } from './QueueOrderJobs/preferred-list-pipeline-query';

export const names = {
  JOB_QUERY: 'JOB_QUERY',
  PIPELINE_QUERY: 'PIPELINE_QUERY',
  PIPELINE_STATS_QUERY: 'PIPELINE_STATS_QUERY',
  ALGORITHMS_QUERY: 'ALGORITHMS_QUERY',
  ALGORITHM_AND_PIPELINE_NAMES: 'ALGORITHM_AND_PIPELINE_NAMES',
  JOB_BY_ID_QUERY: 'JOB_BY_ID_QUERY',
  ALGORITHM_BY_NAME_QUERY: 'ALGORITHM_BY_NAME_QUERY',
  DISCOVERY_QUERY: 'DISCOVERY_QUERY',
  WORKERS_ALL_QUERY: 'WORKERS_ALL_QUERY',
  DRIVERS_ALL_QUERY: 'DRIVERS_ALL_QUERY',
  MANAGED_LIST: 'MANAGED_LIST',
  MANAGED_LIST_TAGS: 'MANAGED_LIST_TAGS',
  MANAGED_LIST_PIPELINE: 'MANAGED_LIST_PIPELINE',
  PREFERRED_LIST: 'PREFERRED_LIST',
  PREFERRED_LIST_TAGS: 'PREFERRED_LIST_TAGS',
  PREFERRED_LIST_PIPELINE: 'PREFERRED_LIST_PIPELINE',
};
