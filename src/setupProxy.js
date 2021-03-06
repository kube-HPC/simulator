const packageJSON = require('./../package.json');

module.exports = app => {
  app.get('*/dashboard-config.json', (req, res) => {
    res.json({
      config: {
        hkubeSystemVersion: process.env.HKUBE_SYSTEM_VERSION,
        baseUrl: packageJSON.homepage,
        monitorBackend: {
          host: process.env.MONITOR_BACKEND_HOST || 'localhost',
          port: process.env.MONITOR_BACKEND_PORT || '30010',
          path: process.env.MONITOR_BACKEND_PATH || '',
          socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
          schema: process.env.isSecure ? 'https://' : 'http://',
        },
        board: {
          host: process.env.BOARD_HOST || 'localhost',
          port: process.env.BOARD_PORT || '30010',
          path: process.env.BOARD_PATH || '',
          schema: process.env.isSecure ? 'https://' : 'http://',
        },
      },
    });
  });
};
