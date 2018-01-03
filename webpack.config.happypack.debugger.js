/**
 * Created by haiyan.
 */
const Webpack = require("webpack");
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 5});
const path = require('path')

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
    entry: {
        vendors: [
            'decimal.js',
            'lodash',
            'moment',
            'pinyin'
        ]
    },

    output: {
        filename: '[name].dll.js',
        path: path.join(__dirname, 'www/vendors_bundle'),
        library
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happybabel'
            }
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'www/vendors_bundle/[name]-manifest.json'),
            name: library,
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin(
            {
                beautify: false,
                compress: {
                    warnings: true
                },
                mangle: {
                    except: ['$scope']
                }
            }
        ),
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            cache: true,
            verbose: true
        })
    ]
};
