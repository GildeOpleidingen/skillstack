const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [] // will be filled in dev/prod configs
      },
      {
        test: /\.ejs$/,
        use: [
          { loader: 'ejs-loader', options: { esModule: false, variable: 'data' } }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/i,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css', '.ejs']
  }
};
