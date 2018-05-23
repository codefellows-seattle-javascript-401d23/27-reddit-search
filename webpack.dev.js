'use strict';

const { HotModuleReplacementPlugin } = require('webpack');
const commonConfig = require('./webpack.common');
const merge = require('webpack-merge');
// THIS IS AN ES 5 FILE

const webpackDevConfig = {};

webpackDevConfig.mode = 'development'; // this is meaningful to webpack-- production will actually transpile it differently-- non-human readable style, minified-- both for performance and security, judy says is sorta like hashing

// this maps our compiled and pre-compiled line numbers
webpackDevConfig.devtool = 'inline-source-map';


// this keeps track of SPA 'history'
webpackDevConfig.devServer = {
  contentBase: './build', // tells server where to serve content from
  open: true, // this opens a new tab each time
  hot: true, // enables hot reloading
  historyApiFallback: true, // enables us to go to non exist routes without 404 error
};

// this plugin is CPU intensive
webpackDevConfig.plugins = [
  new HotModuleReplacementPlugin(),
];

webpackDevConfig.module = {};

webpackDevConfig.module.rules = [
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader',
    ],
  },
]; // webpack reads these files from the bottom up, order matters here-- any time you see a use property, that takes an array, webpack loads them bottom up (or popping them from the array)

module.exports = merge(commonConfig, webpackDevConfig);

