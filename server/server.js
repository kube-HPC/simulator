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
  const fullUrl = `${req.protocol}://${req.get('host')}`;
  console.log('1.', fullUrl);
  console.log(`2. ${baseUrl}/`);

  if (baseUrl !== '' && req.url.endsWith(`${baseUrl}`)) {
    console.log(`error baseUrl redirect`);
    res.redirect(`${fullUrl}${baseUrl}/`);
  } else {
    next();
  }
});

app.get('/*', (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}`;
  console.log('3.', fullUrl);
  console.log(`4. ${baseUrl}`);

  if (baseUrl !== '' && req.url.endsWith(`${baseUrl}`)) {
    console.log(`error baseUrl redirect`);
    res.redirect(`${fullUrl}${baseUrl}/`);
  } else {
    res.send(indexHtmlContent);
  }
});

const server = http.createServer(app);
server.listen(DEFAULT_PORT, () => {
  console.info('Listening on port', DEFAULT_PORT);
});
