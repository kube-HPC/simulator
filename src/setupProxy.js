const buildDashboardConfig = require('../server/dashboardConfig.mjs');

module.exports = app => {
  app.get('*/dashboard-config.json', (req, res) => {
    res.json({
      config: buildDashboardConfig(),
    });
  });
};
