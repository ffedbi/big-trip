/* global __dirname */

const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/js/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public/js`)
  },
  devtool: `source-map`,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: `babel-loader`
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    hot: true,
    compress: true
  }
};
