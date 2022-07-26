export { default as JOB_QUERY } from './Jobs/job-query';
export { default as JOB_GRID_VIEW_QUERY } from './Jobs/jobs-grid-view-query';
export { default as JOB_BY_ID_QUERY } from './Jobs/job-by-id-query';
export { default as JOB_QUERY_GRAPH } from './Jobs/job-query-graph';

export { default as PIPELINE_QUERY } from './pipeline-query';
export { default as PIPELINE_STATS_QUERY } from './pipeline-stats-query';

export { default as ALGORITHMS_QUERY } from './algorithms-query';
export { default as ALGORITHM_BUILDS_FRAGMENTS } from './algorithm-builds-by-name-fragments';
export { default as ALGORITHM_AND_PIPELINE_NAMES } from './algorithm-pipeline-names';
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

export { default as DATASOURCES_LIST_QUERY } from './DataSources/list-datasources-query';
export { default as DATASOURCE_BY_ID_QUERY } from './DataSources/datasources-by-id-query';
export { default as DATASOURCE_VERSIONS_QUERY } from './DataSources/datasource-versions-query';
export { default as DATASOURCE_SNAPANSHOTS_QUERY } from './DataSources/dataSource-snapanshots-query';
export { default as DATASOURCE_PREVIEW_QUERY } from './DataSources/dataSource-preview-query';

export { default as ERROR_LOG_QUERY } from './error-log-query';
export { default as DISK_SPACE_QUERY } from './disk-space-query';
export { default as NODE_STATISTICS_QUERY } from './node-statistics-query';
export { default as COUNTERS_QUERY } from './counters-query';
export { default as EXPERIMENTS_QUERY } from './experiments-query';

export const names = {
  JOB_QUERY: 'JOB_QUERY',
  JOB_QUERY_GRAPH: 'JOB_QUERY_GRAPH',
  JOB_GRID_VIEW_QUERY: 'JOB_GRID_VIEW_QUERY',
  PIPELINE_QUERY: 'PIPELINE_QUERY',
  PIPELINE_STATS_QUERY: 'PIPELINE_STATS_QUERY',
  ALGORITHMS_QUERY: 'ALGORITHMS_QUERY',
  ALGORITHM_BUILDS_FRAGMENTS: 'ALGORITHM_BUILDS_FRAGMENTS',
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
  DATASOURCE_PREVIEW_QUERY: 'DATASOURCE_PREVIEW_QUERY',
  DATASOURCE_BY_ID_QUERY: 'DATASOURCE_BY_ID_QUERY',
  DATASOURCE_VERSIONS_QUERY: 'DATASOURCE_VERSIONS_QUERY',
  DATASOURCE_SNAPANSHOTS_QUERY: 'DATASOURCE_SNAPANSHOTS_QUERY',
  DATASOURCES_LIST_QUERY: 'DATASOURCES_LIST_QUERY',
  ERROR_LOG_QUERY: 'ERROR_LOG_QUERY',
  DISK_SPACE_QUERY: 'DISK_SPACE_QUERY',
  NODE_STATISTICS_QUERY: 'NODE_STATISTICS_QUERY',
  COUNTERS_QUERY: 'COUNTERS_QUERY',
  EXPERIMENTS_QUERY: 'EXPERIMENTS_QUERY',
};
