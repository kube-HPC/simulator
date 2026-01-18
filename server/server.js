const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });
const express = require('express');
const http = require('http');
const fs = require('fs');
const { indexHtml, baseUrl } = require('./setupConfig.cjs');
const buildDashboardConfig = require('./dashboardConfig.mjs');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 9050;

const indexHtmlContent = fs
  .readFileSync(indexHtml, 'utf-8')
  .replace(/__BASE_URL_TOKEN__/g, `/${baseUrl}/`);

app.use(express.static(path.join(__dirname, '../build')));

app.get('*/dashboard-config.json', (req, res) => {
  res.json({
    config: buildDashboardConfig(),
  });
});

app.get('/*', (req, res) => {
  res.send(indexHtmlContent);
});

const server = http.createServer(app);
server.listen(DEFAULT_PORT, () => {
  console.info('Listening on port', DEFAULT_PORT);
});
