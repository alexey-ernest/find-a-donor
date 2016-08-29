var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, '../build');
var nodeModulesPath = path.resolve(__dirname, '../node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  entry: [path.join(__dirname, '../src/js/app.js')],
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: 'js/bundle.js', // Name of output file
  },
  plugins: [
    // Define production build to allow React to strip out unnecessary checks
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // suppresses warnings, usually from module minification
        warnings: false,
      },
      output: {
        comments: false
      }
    }),
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),
    // Extract css
    new ExtractTextPlugin('css/styles.css'),
    // Generate index.html
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      //favicon: 'src/favicon.ico',
      hash: true
    }),
    // Moves files
    new TransferWebpackPlugin([
      {from: 'images', to: 'images'},
    ], path.resolve(__dirname, '../src')),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader?sourceMap')
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
