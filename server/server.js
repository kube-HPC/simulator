const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 9050;

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
app.get('/config', (req, res) => {
    res.json({
        config: {
            monitorBackend: {
                useLocation: process.env.MONITOR_BACKEND_USE_LOCATION || 'true',
                host: process.env.MONITOR_BACKEND_HOST || 'localhost',
                port: process.env.MONITOR_BACKEND_PORT || '30010',
                path: process.env.MONITOR_BACKEND_PATH || '',
                socketIoPath: process.env.MONITOR_BACKEND_PATH_SOCKETIO || '',
                schema: process.env.isSecure ? 'https://' : 'http://'
            }
        }
    })
})
const server = http.createServer(app);
server.listen(DEFAULT_PORT, () => {
    console.log('Listening on port', DEFAULT_PORT);
});
