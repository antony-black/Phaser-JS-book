const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {

    port: 8080,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'singletonStyleTag' },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    
  new HtmlWebpackPlugin({ template: './src/index.html' }),

  new CopyPlugin({
    patterns: [
      {
        from: "assets",
        to: 'assets',
        force: true,
      },
    ],
  })
],
  
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
};