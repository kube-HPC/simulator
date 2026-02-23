import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import path from 'path';
import svgr from '@svgr/rollup';
import buildDashboardConfig from './server/dashboardConfig.mjs';

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

export default defineConfig(({ mode }) => {
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

    base: './',

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
        src: path.resolve(process.cwd(), 'src'),
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
      assetInlineLimit: 0,

      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            monaco: ['monaco-editor'],
            graph: ['react-graph-vis'],
          },
        },
      },
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
