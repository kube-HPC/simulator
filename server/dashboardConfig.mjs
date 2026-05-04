import * as setupConfig from './setupConfig.mjs';

const {
  monitorBackend,
  board,
  hkubeSystemVersion,
  kibanaUrl,
  ELASTICSEARCH_LOGS_INDEX,
  structuredPrefix,
  grafanaUrl,
  grafanaDashboardUrl,
  dataSourceIsEnable,
  keycloakEnable,
  checkIframe,
  inactiveCheckMs,
  baseUrl,
} = setupConfig;

const buildDashboardConfig = () => ({
  hkubeSystemVersion,
  kibanaUrl,
  ELASTICSEARCH_LOGS_INDEX,
  structuredPrefix,
  grafanaUrl,
  grafanaDashboardUrl,
  dataSourceIsEnable,
  keycloakEnable,
  checkIframe,
  inactiveCheckMs,
  baseUrl,
  monitorBackend,
  board,
});

export default buildDashboardConfig;
