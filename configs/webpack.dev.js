var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, '../build');
var nodeModulesPath = path.resolve(__dirname, '../node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  // Entry points to the project
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../src/js/app.js')
  ],
  // Server Configuration options
  devServer: {
    contentBase: '../src', // Relative directory for base of server
    devtool: 'eval',
    hot: true, // Live-reload
    inline: true,
    port: 3000, // Port Number
    host: 'localhost', // Change to '0.0.0.0' for external facing server
  },
  devtool: 'eval',
  output: {
    path: buildPath, // Path of output file
    filename: 'js/bundle.js',
  },
  plugins: [
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),
    // Extract css
    new ExtractTextPlugin('css/styles.css'),
    // Generate index.html
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      //favicon: 'src/favicon.ico'
    }),
    // Moves files
    new TransferWebpackPlugin([
      {from: 'images', to: 'images'},
    ], path.resolve(__dirname, '../src')),
  ],
  module: {
    loaders: [
      {
        // React-hot loader and
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      },
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&modules!sass-loader?sourceMap')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      },
      {
        test: /\.(png|gif|jpg)$/,
        loader: 'url-loader?limit=5000&name=../images/[name].[ext]&emitFile=false'
      }
    ],
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, '../src/sass'),
      path.resolve(nodeModulesPath, './compass-mixins/lib'),
      path.resolve(nodeModulesPath, './susy/sass'),
      path.resolve(nodeModulesPath, './breakpoint-sass/stylesheets')
    ]
  }
};

module.exports = config;
