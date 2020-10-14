const path = require('path');
const webpack = require('webpack');
const wextManifest = require('wext-manifest');
const ZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteWebpackPlugin = require('write-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const manifestInput = require('./src/manifest');

const viewsPath = path.join(__dirname, 'views');
const sourcePath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';
const targetBrowser = process.env.TARGET_BROWSER;
const manifest = wextManifest[targetBrowser](manifestInput);

const extensionReloaderPlugin =
  nodeEnv === 'development'
    ? new ExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: 'contentScript',
          background: 'background'
        }
      })
    : () => {
        this.apply = () => {};
      };

const getExtensionFileType = browser => {
  if (browser === 'opera') {
    return 'crx';
  }

  if (browser === 'firefox') {
    return 'xpi';
  }

  return 'zip';
};

module.exports = {
  mode: nodeEnv,

  entry: {
    background: path.join(sourcePath, 'Background', 'index.js'),
    contentScript: path.join(sourcePath, 'ContentScript', 'index.js')
  },

  output: {
    filename: 'js/[name].bundle.js',
    path: path.join(destPath, targetBrowser)
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader', // For autoprefixer
            options: {
              ident: 'postcss',
              // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
              plugins: [require('autoprefixer')()]
            }
          },
          'resolve-url-loader', // Rewrites relative paths in url() statements
          'sass-loader' // Takes the Sass/SCSS file and compiles to the CSS
        ]
      }
    ]
  },

  plugins: [
    // environmental variables
    new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`
        )
      ],
      cleanStaleWebpackAssets: false,
      verbose: true
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    // copy static assets
    new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets' }] }),
    // write manifest.json
    new WriteWebpackPlugin([
      { name: manifest.name, data: Buffer.from(manifest.content) }
    ]),
    // plugin to enable browser reloading in development mode
    extensionReloaderPlugin
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      }),
      new ZipPlugin({
        path: destPath,
        extension: `${getExtensionFileType(targetBrowser)}`,
        filename: `${targetBrowser}`
      })
    ]
  }
};
