const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const packageConfig = require('./package.json');
const appEnv = process.env.NODE_ENV || 'development';
const appPath = path.join(__dirname, 'app');
const distPath = path.join(__dirname, 'dist');
const exclude = [/node_modules/, /thirdParty/];
const excludeThirdParty = /thirdParty/;
const config = {
  // The base directory for resolving `entry` (must be absolute path)
  context: appPath,
  entry: {
    app: 'app.js',
    vendor: Object.keys(packageConfig.dependencies)
  },
  resolve: {
    modules: ['node_modules', appPath],
    extensions: ['.js', '.jsx']
  },
  output: {
    // The bundling output directory (must be absolute path)
    path: distPath,
    // Set proper base URL for serving resources
    publicPath: '/',
    // The output filename of the entry chunk, relative to `path`
    // [name] - Will be set per each key name in `entry`
    filename: 'bundle.[chunkhash].js'
  },
  plugins: [
    // Generate index.html with included script tags
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'index.html'
    }),
    // Pass environment variable to frontend scipts
    new webpack.DefinePlugin({
      $_ENVIRONMENT: JSON.stringify(appEnv),
      // We must envify CommonJS builds:
      // https://github.com/reactjs/redux/issues/1029
      'process.env.NODE_ENV': JSON.stringify(appEnv)
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: path.join(__dirname, '.eslintrc'),
          failOnError: false,
          failOnWarning: false,
          emitWarning: true
        },
        postcss: [
          autoprefixer({
            browsers: ['last 2 versions']
          })
        ]
      }
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: 'assets/images/icons/',
    //     to: 'assets/images/icons/'
    //   }
    // ]),
    new ExtractTextPlugin('app.css')
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude,

      },
      // Expose React as global object
      {
        test: require.resolve('react'),
        loader: 'expose-loader',
        query: 'React'
      },
      // Transpile ES6 and enable Hot Reload
      {
        test: /\.js$/,
        loaders: [
          {
            loader: 'babel-loader',
            query: { cacheDirectory: true }
          }
        ],
        exclude
      },
      // SCSS
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: { root: encodeURIComponent(appPath) }
            },
            { loader: 'postcss-loader' },
            { loader: 'resolve-url-loader' },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true
              }
            }
          ]
        })
      },
      // LESS
      {
        test: /\.(less)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: { root: encodeURIComponent(appPath) }
            },
            { loader: 'postcss-loader' },
            { loader: 'resolve-url-loader' },
            {
              loader: 'less-loader',
              query: {
                sourceMap: true
              }
            }
          ]
        })
      },
      // Allow `require`ing image/font files (also when included in CSS)
      // Inline assets under 5kb as Base64 data URI, otherwise uses `file-loader`
      {
        test: /\.(eot|woff2?|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        query: {
          limit: 5120,
          name: '[name].[hash].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)(\?.*)?$/i,
        loader: 'url-loader',
        query: {
          limit: 5120,
          name: '[name].[hash].[ext]'
        }
      }
    ]
  },
  // Settings for webpack-dev-server
  // `--hot` and `--progress` must be set using CLI
  devServer: {
    contentBase: appPath,
    noInfo: true,
    port: 9050,
    host:'0.0.0.0',
    historyApiFallback: true,
    setup: (app) => {
      app.get('/config', (req, res) => {
        // if (process.env.NODE_ENV != null ) {
          res.json({
            location: {
              Local: {
                url: "http://localhost:8091",
                path: '',
                scriptsPath: '~/dev/vod/rms/scripts',
                user: ''
              },
              LocalK8s: {
                url: 'http://101.150.4.70:8080',
                path: '/api/v1/proxy/namespaces/default/services/worker-statistics-server/socket.io',
                scriptsPath: '../rms/scripts/',
                user: ''
              },
              RMS_50: {
                url: "http://101.150.4.150:8080",
                path: '/api/v1/proxy/namespaces/default/services/worker-statistics-server/socket.io',
                scriptsPath: '../rms/scripts/',
                user:'user'
              },
              RMS_100: {
                url: "http://101.150.4.160:8080/",
                path: '',
                scriptsPath: '../rms/scripts/',
                user:'user'
              },
              SufaT: {
                url: "http://sufa-dev-vdo66:8080/",
                path: '',
                scriptsPath: '../rms/scripts/',
                user:'uvadmin'
              }
            },

          })
        // }
        // else {
        //   res.json({ code: "error" })
        // }

      })

    },
    proxy: {
      '/api': {
        target: 'http://localhost:8091',
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
if (appEnv === 'development') {
  config.devtool = 'inline-source-map';
  config.performance = {
    hints: false
  };
}
if (appEnv !== 'test') {
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[chunkhash].js',
      minChunks: Infinity
    })
  );
}
if (appEnv === 'production') {
  config.plugins.push(
    // Remove build related folders
    new CleanPlugin(['dist']),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        eslint: {
          emitWarning: false
        }
      }
    }),
    // Do not output to dist if there are errors
    new webpack.NoErrorsPlugin()
  );
}
module.exports = config;
