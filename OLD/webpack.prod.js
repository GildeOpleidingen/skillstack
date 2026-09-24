const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'public'),         // root public folder
    filename: 'js/app.[contenthash].js',            // main bundle
    chunkFilename: 'js/[name].[contenthash].js',    // lazy-loaded chunks
    publicPath: '/',                                // ensures correct paths
    clean: true                                     // clean old files
  },
  module: {
    rules: [
      // JS Loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      },
      // CSS Loader
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      // EJS Loader
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
            options: { esModule: false, variable: 'data' }
          }
        ]
      },
      // Assets
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]' // puts all assets in public/assets
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      // new CssMinimizerPlugin() // optional, enable if CSS parsing is fixed
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',  // important for lazy-loaded chunks
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.[contenthash].css' // CSS in public/css
    }),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: 'index.html',                     // root public/index.html
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      }
    }),
    new WebpackObfuscator(
      {
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75
      },
      []
    )
  ],
  resolve: {
    extensions: ['.js', '.css', '.ejs']
  }
};
