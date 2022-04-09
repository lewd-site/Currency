const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '...'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  externals: {
    dotenv: 'commonjs dotenv',
    koa: 'commonjs koa',
    '@koa/cors': 'commonjs @koa/cors',
    'koa-router': 'commonjs koa-router',
    'koa-helmet': 'commonjs koa-helmet',
    'koa-conditional-get': 'commonjs koa-conditional-get',
    'koa-etag': 'commonjs koa-etag',
    'koa-static': 'commonjs koa-static',
    '@popeindustries/lit-html-server': 'commonjs @popeindustries/lit-html-server',
    'node-fetch-commonjs': 'commonjs node-fetch-commonjs',
  },
  plugins: [new webpack.ProgressPlugin()],
};
