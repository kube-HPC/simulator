import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const setupConfig = require('./setupConfig.mjs');

const {
  monitorBackend,
  board,
  hkubeSystemVersion,
  kibanaUrl,
  structuredPrefix,
  grafanaUrl,
  grafanaDashboardUrl,
  dataSourceIsEnable,
  keycloakEnable,
  baseUrl,
} = setupConfig;

const buildDashboardConfig = () => ({
  hkubeSystemVersion,
  kibanaUrl,
  structuredPrefix,
  grafanaUrl,
  grafanaDashboardUrl,
  dataSourceIsEnable,
  keycloakEnable,
  baseUrl,
  monitorBackend,
  board,
});

export default buildDashboardConfig;
