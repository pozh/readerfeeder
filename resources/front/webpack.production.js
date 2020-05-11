const path = require('path');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const compressionPlugin = new CompressionPlugin();
const definePlugin = new webpack.DefinePlugin({
  API_ROOT: JSON.stringify('/api'),
  GOOGLE_APP_ID: JSON.stringify('218868329575-r8ou1d3et0a2k5rrmairq691oqir8tf9.apps.googleusercontent.com'),
  FACEBOOK_APP_ID: JSON.stringify('2340051056323088'),
  PRO_PLAN_ID: JSON.stringify('530517'),
  VENDOR_ID: JSON.stringify('19002'),
  TOKEN: JSON.stringify('token'),
  __DEV__: JSON.stringify('false'),
  'process.env': { NODE_ENV: JSON.stringify('production') }
});

const stylesheetsPlugin = new MiniCssExtractPlugin({
  filename: 'styles/[name].css'
});

const includePaths = [
  path.resolve(__dirname, './src/assets/styles'),
  path.resolve(__dirname, './node_modules/bootstrap/scss'),
];


module.exports = {

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },

  context: path.join(__dirname, 'src'),
  entry: {
    app: 'index.js',
  },

  output: {
    publicPath: '/assets/',
    filename: 'js/[name].js',
    path: path.join(__dirname, '../../public/assets')
  },

  plugins: [
    stylesheetsPlugin,
    definePlugin,
    compressionPlugin,
  ],

  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'src')
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }, {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'sass-loader',
          options: {
            includePaths,
            outputPath: 'styles',
            modules: false,
            localIdentName: '[path]-[local]-[hash:base64:3]',
            data: `
              @import "src/assets/styles/variables";
              @import '~bootstrap/scss/variables';
              @import '~bootstrap/scss/functions';
              @import '~bootstrap/scss/mixins';
            `
          }
        }]
      }, {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'sass-loader',
          options: {
            outputPath: 'styles',
            indentedSyntax: 'sass',
          }
        }]
      }, {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'less-loader',
          options: {
            outputPath: 'styles'
          }
        }]
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          outputPath: 'images',
          name: '[name].[ext]',
          limit: 2000,
        }
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts',
        }
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          outputPath: 'fonts',
          name: '[name].[ext]',
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          outputPath: 'fonts',
          name: '[name].[ext]',
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          outputPath: 'fonts',
          name: '[name].[ext]',
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          outputPath: 'images',
          name: '[name].[ext]',
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      }, {
        test: /\.ico$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images'
        }
      }
    ]
  }
};
