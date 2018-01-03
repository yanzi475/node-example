/**
 * Created by haiyan.
 */
var Webpack = require("webpack");
module.exports = {
  entry: ["./js/router.js"],
  output: {
    path: "./js",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: require.resolve('./js/main'),
        loader: "exports?testComponent"
      },
      {
        test: require.resolve('./js/result'),
        loader: "exports?testComponent"
      },
      // {
      //   test: require.resolve('./js/tutorial'),
      //   loader: "exports?testComponent"
      // },
      {
        test: /\.(png|jpg)$/,
        loader: "url"
    }]
  }
}
