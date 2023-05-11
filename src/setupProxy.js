const packageJSON = require('./../package.json');

module.exports = app => {
  app.get('*/dashboard-config.json', (req, res) => {
    res.json({
      config: {
        envs: process.env,
        hkubeSystemVersion: process.env.HKUBE_SYSTEM_VERSION,
        kibanaUrl: process.env.KIBANA_URL,
        grafanaUrl: process.env.GRAFANA_URL,
        dataSourceIsEnable: process.env.DATA_SOURCE_IS_ENABLE === 'true',
        baseUrl: packageJSON.homepage,
        monitorBackend: {
          host: process.env.API_SERVER_BACKEND_HOST || 'localhost',
          port: process.env.API_SERVER_BACKEND_PORT || '3000',
          path: process.env.API_SERVER_BACKEND_PATH || '',
          // socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
          schema: process.env.isSecure ? 'https://' : 'http://',
          hkubeSiteUrl: process.env.REACT_APP_SITEBASEURL || '',
        },
        board: {
          host: process.env.BOARD_HOST || 'localhost',
          port: process.env.BOARD_PORT || '3000',
          path: process.env.BOARD_PATH || '',
          schema: process.env.isSecure ? 'https://' : 'http://',
        },
      },
    });
  });
};
