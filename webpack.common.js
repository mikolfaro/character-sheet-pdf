module.exports = {
  entry: './src/Pf2/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.pdf$|\.ttf/,
        type: "asset/inline",
      },
      {
        test: /embedded\.js/,
        type: 'asset/source',
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
