const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // new HtmlBundlerPlugin({
    //   entry: {
    //     index: './src/views/index.html', // path to template file
    //   },
    // }),
    new HtmlWebpackPlugin({})
//     hash: true,
//     template: "src/index.html"
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    client: {
      overlay: false
    }
  },
  stats: {warnings:false}
};