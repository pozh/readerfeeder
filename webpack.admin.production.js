const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: 'index.html' });
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const compressionPlugin = new CompressionPlugin();

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify('false'),
  'process.env': {NODE_ENV: JSON.stringify('production')}
});
const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } });
const stylesheetsPlugin = new ExtractTextPlugin('assets/styles/[name].css');

const includePaths = [
  path.resolve(__dirname, './resources/front/src/admin/assets/styles'),
  path.resolve(__dirname, './node_modules/bootstrap/scss'),
];

const stylesheetsLoaders = [
  {
      loader: 'css-loader',
      options: {
          modules: false,
          sourceMap: false,
          minimize: true
      }
}];

module.exports = {
  context: path.join(__dirname, 'resources/front/src'),
  entry: './admin/index.js',
  output: {
    publicPath: '/',
    filename: 'assets/js/admin.js',
    path: path.join(__dirname, 'public')
  },
  plugins: [
    stylesheetsPlugin,
    htmlWebpackPlugin,
    definePlugin,
    uglifyPlugin,
    compressionPlugin,
  ],
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'resources/front/src/shared'),
      path.join(__dirname, 'resources/front/src/admin')
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
        use: ExtractTextPlugin.extract({use: stylesheetsLoaders})
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({ use: [...stylesheetsLoaders, {
          loader: 'sass-loader',
          options: {
            includePaths: includePaths,
          }
        }]})
      }, {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({use: [...stylesheetsLoaders, {
            loader: 'sass-loader',
            options: {
              indentedSyntax: 'sass',
              includePaths: includePaths,
            }
          }]
        })
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options:  {
          limit: 2000,
          name: 'assets/images/[name].[ext]'
        }
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: 'assets/[name].[ext]'
        }
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options:  {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options:  {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options:  {
          limit: 10000,
          name: 'assets/images/[name].[ext]',
          mimetype: 'application/octet-stream'
        }
      }, { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options:  {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      }, {test: /\.ico$/,
        loader: "file-loader",
        options: {
          name: 'assets/images/[name].[ext]'
        }
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [...stylesheetsLoaders, {
            loader: 'less-loader'
          }]
        })
      }
    ]
  }
};