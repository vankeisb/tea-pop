// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts',
    css: './src/style.scss',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            // options: {
            //   modules: false,
            // },
          },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].css',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
  },
};
