const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: 'app.html' });
const definePlugin = new webpack.DefinePlugin({
  API_ROOT: JSON.stringify('http://rf.local/api'),
  SOCIAL_ROOT: JSON.stringify('http://rf.local/redirect'),
  __DEV__: JSON.stringify('true')
});

const includePaths = [
  path.resolve(__dirname, './resources/front/src/assets/styles'),
  path.resolve(__dirname, './node_modules/bootstrap/scss'),
];

const stylesheetsLoaders = [
  { loader: 'style-loader' },
  { loader: 'css-loader',
    options: {
      modules: false,
      localIdentName: '[path]-[local]-[hash:base64:3]',
      sourceMap: true
    }
  }
];

module.exports = {
  context: path.join(__dirname, 'resources/front/src'),
  mode: 'development',
  entry: './index',
  output: {
    publicPath:    "/",
    filename: '[hash].js',
  },
  devtool: 'source-map',
  plugins: [
    htmlWebpackPlugin,
    definePlugin,
  ],
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'resources/front/src')
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
        use: stylesheetsLoaders
      }, {
        test: /\.scss$/,
        use: [...stylesheetsLoaders, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: includePaths,
            data: `
              @import "resources/front/src/assets/styles/variables";
              @import '~bootstrap/scss/variables';
              @import '~bootstrap/scss/functions';
              @import '~bootstrap/scss/mixins';
            `
          }
        }]
      }, {
        test: /\.sass$/,
        use: [...stylesheetsLoaders, {
          loader: 'sass-loader',
          options: {
            indentedSyntax: 'sass',
            sourceMap: true
          }
        }]
      }, {
       test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options:  {
          limit: 25000,
          name: 'images/[hash]-[name].[ext]'
        }
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      },
    ]
  },
  devServer: {
    historyApiFallback: true,
    host: "rf.local",
    port: 8081,
    proxy: {
      '/api*': "http://localhost:8181"
    }
  }
};
