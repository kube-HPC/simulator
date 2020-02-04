const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 9050;

const parseBool = value => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string' && value.toLowerCase() === 'false') {
    return false;
  }
  return true;
};

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/config', (req, res) => {
  res.json({
    config: {
      monitorBackend: {
        useLocation: parseBool(process.env.MONITOR_BACKEND_USE_LOCATION),
        host: process.env.MONITOR_BACKEND_HOST || 'localhost',
        port: process.env.MONITOR_BACKEND_PORT || '30010',
        path: process.env.MONITOR_BACKEND_PATH || '',
        socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
        schema: process.env.isSecure ? 'https://' : 'http://',
      },
      board: {
        useLocation: parseBool(process.env.BOARD_USE_LOCATION),
        host: process.env.BOARD_HOST || 'localhost',
        port: process.env.BOARD_PORT || '30010',
        path: process.env.BOARD_PATH || '',
        schema: process.env.isSecure ? 'https://' : 'http://',
      },
    },
  });
});

const server = http.createServer(app);
server.listen(DEFAULT_PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', DEFAULT_PORT);
});
