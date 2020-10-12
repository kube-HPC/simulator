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

export const hkubeSystemVersion = process.env.HKUBE_SYSTEM_VERSION;

export const baseUrl = process.env.HKUBE_BASE_URL
  ? process.env.HKUBE_BASE_URL.replace(/^\//, '')
  : '';

export const BOARD_HOST = process.env.BOARD_HOST || 'localhost';
export const BOARD_PORT = process.env.BOARD_PORT || '3005';

export const indexHtml = path.join(__dirname, '../build', 'index.html');

export const monitorBackend = {
  useLocation: parseBool(process.env.MONITOR_BACKEND_USE_LOCATION),
  host: process.env.MONITOR_BACKEND_HOST || 'localhost',
  port: process.env.MONITOR_BACKEND_PORT || '30010',
  path: process.env.MONITOR_BACKEND_PATH || '',
  socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
};

export const board = {
  baseUrl,
  useLocation: parseBool(process.env.BOARD_USE_LOCATION),
  host: BOARD_HOST,
  port: BOARD_PORT,
  path: process.env.BOARD_PATH || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
};

export const fullBaseUrl = `${board.schema}${board.host}:${board.port}/${board.baseUrl}/`;
