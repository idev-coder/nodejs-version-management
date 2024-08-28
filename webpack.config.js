const path = require('path');

module.exports = {
  entry: {
    bin:'./src/bin.ts',
    n:'./src/n-bin.ts',
    node:'./src/node-bin.ts',
    npm:'./src/npm-bin.ts',
    npx:'./src/npx-bin.ts'
  },
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'bin'),
  },
};