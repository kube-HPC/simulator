const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });
const express = require('express');
const http = require('http');
const fs = require('fs');
const {
  monitorBackend,
  board,
  hkubeSystemVersion,
  kibanaUrl,
  dataSourceIsEnable,
  indexHtml,
  baseUrl,
} = require('./setupConfig');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 9050;
console.log('ziv test baseUrl', baseUrl);
console.log('ziv test baseUrl path', path);

const indexHtmlContent = fs
  .readFileSync(indexHtml, 'utf-8')
  .replace(/__BASE_URL_TOKEN__/g, `/${baseUrl}/`);

app.use(express.static(path.join(__dirname, '../build')));

app.get('*/dashboard-config.json', (req, res) => {
  res.json({
    config: {
      hkubeSystemVersion,
      kibanaUrl,
      dataSourceIsEnable,
      baseUrl,
      monitorBackend,
      board,
    },
  });
});

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log('1.', fullUrl);

  console.log(`2. ${baseUrl}/`);
  //  if (req.originalUrl.indexOf(`${baseUrl}/`) === -1) {
  //   res.redirect(`${fullUrl  }/`);
  // }

  if (req.url.includes(`${baseUrl}/`)) {
    next();
  }
  res.redirect(`${fullUrl}/`);
});

app.get('/*', (req, res) => {
  res.send(indexHtmlContent);
});

const server = http.createServer(app);
server.listen(DEFAULT_PORT, () => {
  console.info('Listening on port', DEFAULT_PORT);
});
