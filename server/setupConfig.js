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

const baseUrl = process.env.HKUBE_BASE_URL
  ? process.env.HKUBE_BASE_URL.replace(/^\//, '')
  : '';

const BOARD_HOST = process.env.BOARD_HOST || 'localhost';
const BOARD_PORT = process.env.BOARD_PORT || '3005';

const indexHtml = path.join(__dirname, '../build', 'index.html');

const monitorBackend = {
  useLocation: parseBool(process.env.MONITOR_BACKEND_USE_LOCATION),
  host: process.env.MONITOR_BACKEND_HOST || 'localhost',
  port: process.env.MONITOR_BACKEND_PORT || '30010',
  path: process.env.MONITOR_BACKEND_PATH || '',
  socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
};

const board = {
  baseUrl,
  useLocation: parseBool(process.env.BOARD_USE_LOCATION),
  host: BOARD_HOST,
  port: BOARD_PORT,
  path: process.env.BOARD_PATH || '',
  schema: process.env.isSecure ? 'https://' : 'http://',
};

module.exports = {
  hkubeSystemVersion,
  baseUrl,
  board,
  BOARD_HOST,
  BOARD_PORT,
  indexHtml,
  monitorBackend,
};
