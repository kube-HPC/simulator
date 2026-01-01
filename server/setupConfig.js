const path = require('path');

const parseBool = value => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string' && value.toLowerCase() === 'false') {
    return false;
  }
  return true;
};

const hkubeSystemVersion = process.env.HKUBE_SYSTEM_VERSION;
const kibanaUrl = process.env.KIBANA_URL;
const structuredPrefix = process.env.ELASTICSEARCH_STRUCTURED_PREFIX;
const grafanaUrl = process.env.GRAFANA_URL;
const grafanaDashboardUrl = process.env.GRAFANA_URL;

const dataSourceIsEnable = process.env.DATA_SOURCE_IS_ENABLE === 'true';
const keycloakEnable = process.env.VITE_KEYCLOAK_ENABLE === 'true';

const baseUrl = process.env.HKUBE_BASE_URL
  ? process.env.HKUBE_BASE_URL.replace(/^\//, '')
  : '';

const BOARD_HOST = process.env.BOARD_HOST || 'localhost';
const BOARD_PORT = process.env.BOARD_PORT || '3005';

const indexHtml = path.join(__dirname, '../build', 'index.html');

const monitorBackend = {
  useLocation: parseBool(process.env.API_SERVER_BACKEND_USE_LOCATION),
  host: process.env.API_SERVER_BACKEND_HOST || 'localhost',
  port: process.env.API_SERVER_BACKEND_PORT || '3000',
  path: process.env.API_SERVER_BACKEND_PATH || '',
  datasourcesPath:
    process.env.API_SERVER_BACKEND_DATASOURCES_SERVICE_PATH || '',
  // socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
  hkubeSiteUrl: process.env.REACT_APP_SITEBASEURL || '',
};

const board = {
  useLocation: parseBool(process.env.BOARD_USE_LOCATION),
  host: BOARD_HOST,
  port: BOARD_PORT,
  path: process.env.BOARD_PATH || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
};

module.exports = {
  hkubeSystemVersion,
  kibanaUrl,
  structuredPrefix,
  grafanaUrl,
  grafanaDashboardUrl,
  dataSourceIsEnable,
  keycloakEnable,
  baseUrl,
  board,
  BOARD_HOST,
  BOARD_PORT,
  indexHtml,
  monitorBackend,
};
