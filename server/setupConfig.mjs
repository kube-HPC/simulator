import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const parseBool = value => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string' && value.toLowerCase() === 'false') {
    return false;
  }
  return true;
};

export const hkubeSystemVersion = process.env.HKUBE_SYSTEM_VERSION;
export const kibanaUrl = process.env.KIBANA_URL;
export const structuredPrefix = process.env.ELASTICSEARCH_STRUCTURED_PREFIX;
export const grafanaUrl = process.env.GRAFANA_URL;
export const grafanaDashboardUrl = process.env.GRAFANA_URL;

export const dataSourceIsEnable = process.env.DATA_SOURCE_IS_ENABLE === 'true';
export const keycloakEnable = process.env.VITE_KEYCLOAK_ENABLE === 'true';
export const checkIframe = process.env.VITE_CHECK_IFRAME === 'false';


export const baseUrl = process.env.HKUBE_BASE_URL
  ? process.env.HKUBE_BASE_URL.replace(/^\//, '')
  : '';

export const BOARD_HOST = process.env.BOARD_HOST || 'localhost';
export const BOARD_PORT = process.env.BOARD_PORT || '3005';

export const indexHtml = path.join(__dirname, '../build', 'index.html');

export const monitorBackend = {
  useLocation: parseBool(process.env.API_SERVER_BACKEND_USE_LOCATION),
  host: process.env.API_SERVER_BACKEND_HOST || 'localhost',
  port: process.env.API_SERVER_BACKEND_PORT || '3000',
  path: process.env.API_SERVER_BACKEND_PATH || '',
  datasourcesPath:
    process.env.API_SERVER_BACKEND_DATASOURCES_SERVICE_PATH || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
  hkubeSiteUrl: process.env.REACT_APP_SITEBASEURL || '',
};

export const board = {
  useLocation: parseBool(process.env.BOARD_USE_LOCATION),
  host: BOARD_HOST,
  port: BOARD_PORT,
  path: process.env.BOARD_PATH || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
};
