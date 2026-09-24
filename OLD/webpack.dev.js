const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'app.js',
    publicPath: '/js/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: path.resolve(__dirname, 'public/index.html')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'] // injects CSS into JS
      }
    ]
  }
});
