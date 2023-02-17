const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: './examples/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'doc'),
    globalObject: "this",
    library: {
      name: 'characterSheetPdf',
      type: 'umd',
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'examples/index.html' }),
  ],
  devtool: 'inline-source-map',
});
