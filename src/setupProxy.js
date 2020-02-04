const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: 'http://localhost:8091',
      pathRewrite: { '^/api': '' },
    }),
  );
  app.get('/config', (req, res) => {
    res.json({
      config: {
        monitorBackend: {
          host: process.env.MONITOR_BACKEND_HOST || 'localhost',
          port: process.env.MONITOR_BACKEND_PORT || '30010',
          path: process.env.MONITOR_BACKEND_PATH || '',
          socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
          schema: process.env.MONITOR_BACKEND_IS_SECURED ? 'https://' : 'http://',
        },
        board: {
          host: process.env.BOARD_HOST || 'localhost',
          port: process.env.BOARD_PORT || '30010',
          path: process.env.BOARD_PATH || '',
          schema: process.env.BOARD_IS_SECURED ? 'https://' : 'http://',
        },
      },
    });
  });
};
