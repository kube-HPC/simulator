const proxy = require('http-proxy-middleware');
const packageJSON = require('./../package.json');

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: 'http://localhost:8091',
      pathRewrite: { '^/api': '' },
    })
  );
  app.get('*/dashboard-config.json', (req, res) => {
    res.json({
      config: {
        hkubeSystemVersion: process.env.HKUBE_SYSTEM_VERSION,
        monitorBackend: {
          host: process.env.MONITOR_BACKEND_HOST || 'localhost',
          port: process.env.MONITOR_BACKEND_PORT || '30010',
          path: process.env.MONITOR_BACKEND_PATH || '',
          socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
          schema: process.env.isSecure ? 'https://' : 'http://',
        },
        board: {
          baseUrl: packageJSON.homepage,
          host: process.env.BOARD_HOST || 'localhost',
          port: process.env.BOARD_PORT || '30010',
          path: process.env.BOARD_PATH || '',
          schema: process.env.isSecure ? 'https://' : 'http://',
        },
      },
    });
  });
};
