var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.cssSourceMap,
            extract: true
        })
    },
    devtool: config.cssSourceMap ? '#eval-source-map' : false,
    output: {
        path: config.assetsRoot,
        filename: utils.assetsPath('[name]/index.[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('[name].[chunkhash:8].js'),
        publicPath: '../'
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': config.env
        }),
        // extract css into its own file
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name]/index.[hash:8].css',
            chunkFilename: '[name]/[id].css'
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        ...(config.cssSourceMap
                ? []
                : [new OptimizeCSSPlugin({
                    cssProcessorOptions: {
                        //safe: true,
                        map: false,
                    }
                })]
        ),
        ...utils.htmlPlugins(baseWebpackConfig),
		new TransferWebpackPlugin([
            {from: 'images', to: 'static/images'},
            {from: 'html', to: 'static/html'},
            {from: 'js', to: 'static/js'},
            {from: 'css', to: 'static/css'}
        ], path.resolve(__dirname, '../src/static')),
    ],
    optimization: {
        runtimeChunk: {
           name: entrypoint => `manifest/${entrypoint.name}`
        },
        minimize: true,
        noEmitOnErrors: true,
        occurrenceOrder: true,
        splitChunks: {
            chunks: 'async', // 必须三选一： "initial" | "all" | "async"
            minSize: 30000, // 最小尺寸
            minChunks: 2, //must be greater than or equal 2. The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
            maxAsyncRequests: 5, // 最大异步请求数
            maxInitialRequests: 3, // 最大初始化请求书
            name: true, // 名称，此选项可接收 function
            cacheGroups: {
                vendor: { // key 为entry中定义的 入口名称
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    chunks: 'all', //all-异步加载快，但初始下载量较大，文件共用性好； initial-初始下载量较小，但异步加载量较大，文件间有重复内容
                    priority: -10,
                    reuseExistingChunk: false, // 选项用于配置在模块完全匹配时重用已有的块，而不是创建新块
                    test: /node_modules[\\/]/
                },
                common: {
                    name: 'common',
                    priority: 11,
                    chunks: 'all',
                    test: /[\\/]src[\\/]common[\\/]/,
                },
            }
        }
    },
})

if (config.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = webpackConfig
