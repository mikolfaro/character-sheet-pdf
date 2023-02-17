const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'character-sheet-pdf.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: "this",
    library: {
      name: 'characterSheetPdf',
      type: 'umd',
    }
  },
  plugins: [
    new TerserPlugin({
      extractComments: /^\**!|@preserve|@license|@cc_on|License/i,
    }),
  ],
  devtool: 'source-map',
  externals: ['pdf-lib', 'fetch'],
  resolve: {
    fallback: {
      fetch: require.resolve('node-fetch'),
    },
  }
});
