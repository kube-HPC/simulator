const { defineConfig, loadEnv } = require('vite');
const react = require('@vitejs/plugin-react');
const tsconfigPaths = require('vite-tsconfig-paths').default;
const monacoEditorPlugin = require('vite-plugin-monaco-editor');
const path = require('path');
const svgr = require('@svgr/rollup');
const buildDashboardConfig = require('./server/dashboardConfig');

/**
 * Utils
 */
const resolvePlugin = plugin => (plugin?.default ? plugin.default : plugin);

const toBoolean = value => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

/**
 * 🔑 DEV-ONLY runtime endpoint
 * http://localhost:9050/dashboard-config.json
 */
const dashboardConfigPlugin = {
  name: 'dashboard-config-endpoint',
  configureServer(server) {
    server.middlewares.use('/dashboard-config.json', (req, res) => {
      const config = buildDashboardConfig();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ config }));
    });
  },
};

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isSecure = toBoolean(env.isSecure || process.env.isSecure);

  const backendHost =
    env.API_SERVER_BACKEND_HOST || process.env.API_SERVER_BACKEND_HOST;
  const backendPort =
    env.API_SERVER_BACKEND_PORT || process.env.API_SERVER_BACKEND_PORT;
  const backendSchema =
    env.API_SERVER_BACKEND_SCHEMA || process.env.API_SERVER_BACKEND_SCHEMA;

  const backendOrigin = backendHost
    ? `${backendSchema || (isSecure ? 'https' : 'http')}://${backendHost}${
        backendPort ? `:${backendPort}` : ''
      }`
    : null;

  const apiPath =
    env.API_SERVER_BACKEND_PATH ||
    process.env.API_SERVER_BACKEND_PATH ||
    '/hkube/api-server';

  const socketPath =
    env.API_SERVER_BACKEND_PATH_SOCKETIO ||
    process.env.API_SERVER_BACKEND_PATH_SOCKETIO ||
    '/hkube/monitor-server/socket.io';

  const monacoPlugin = resolvePlugin(monacoEditorPlugin);
  const svgrPlugin = resolvePlugin(svgr);

  return {
    define: {
      global: 'globalThis',
    },

    /**
     * ⚠️ ORDER MATTERS
     * dashboardConfigPlugin MUST be first
     */
    plugins: [
      dashboardConfigPlugin,

      react({
        include: ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'],
      }),

      svgrPlugin ? svgrPlugin({ include: '**/*.svg' }) : null,
      tsconfigPaths(),
      monacoPlugin ? monacoPlugin({}) : null,
    ].filter(Boolean),

    envPrefix: ['VITE_', 'REACT_APP_'],

    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },

    publicDir: 'public',

    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
    },

    build: {
      outDir: 'build',
      sourcemap: true,
      emptyOutDir: true,
    },

    server: {
      host: true,
      port: Number(process.env.PORT) || 9050,
      proxy: backendOrigin
        ? {
            [apiPath]: {
              target: backendOrigin,
              changeOrigin: true,
              secure: isSecure,
              ws: true,
            },
            [socketPath]: {
              target: backendOrigin,
              changeOrigin: true,
              secure: isSecure,
              ws: true,
            },
          }
        : undefined,
    },

    transformIndexHtml: {
      enforce: 'pre',
      transform: (html, ctx) =>
        ctx?.server ? html.replace(/__BASE_URL_TOKEN__/g, '/') : html,
    },
  };
});
