import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { indexHtml, baseUrl } from './setupConfig.mjs';
import buildDashboardConfig from './dashboardConfig.mjs';

// כדי לקבל __dirname ב-ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 9050;

// load html
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
