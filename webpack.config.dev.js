/**
 * Created by haiyan.
 */
var Webpack = require("webpack");

// 方便切换不同的 devtool
var devtools = [
    'source-map',
    // 映射 ES6 代码对应行
    'cheap-module-eval-source-map',
    // 映射 ES5 代码对应行
    'cheap-eval-source-map',
    // 映射 ES5 代码
    'eval'
];


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
