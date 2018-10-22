var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var {VueLoaderPlugin} = require('vue-loader');
module.exports = {
    entry: {
        "demo": './src/modules/demo/index.js'
        "ucar": './src/modules/ucar/index.js',
    },
    mode: "development", //production
    output: {
        path: "./dist/{dev,qa,prod}",
        chunkFilename:'[name]/main.[contenthash:8].js'
        filename: '[name]/main.[contenthash:8].js',
        publicPath: ""
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'images': resolve('src/static/images'),
            'lib': resolve('src/common/lib'),
            //import {format} from 'lib/date'
            'sass': resolve('src/common/sass')
        }
    },
    devtool: '#eval-source-map', //
    module: {
        rules: [
            {
              test: /\.(js|vue)$/,
              loader: 'eslint-loader',
              enforce: 'pre',
              include: [resolve('src'), resolve('test')],
              options: {
                formatter: require('eslint-friendly-formatter')
              }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                include: [resolve('src'), resolve('test')],
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: [
                    //step-2
                    'babel-loader?cacheDirectory'
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('static/images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('static/fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new AssetsPlugin({
            filename: SW_CONFIG_NAME,
            path: config.assetsRoot,
            prettyPrint: true,
            processOutput: function (assets) {
                var content = fs.readFileSync(resolve('src/service-worker.js'),'utf-8');
                var finalFile = path.join(config.assetsRoot + '/service-worker.js');
                content = content.replace('<%SW_CONFIG_NAME%>', SW_CONFIG_NAME);
                fs.writeFileSync( finalFile,content, {encoding: 'utf-8'} );
                var newAssets = ProcessSWOutput.process(assets);
                return 'var sw_config = ' + JSON.stringify(newAssets)
              }
        }),
        new webpack.DefinePlugin({
            'process.env': config.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin(Object.assign({
        template: './src/views/' + exConfig.module + '.ejs',
        inject: true,
        env: process.env.BUILD_ENV
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: false
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        },
        chunksSortMode: 'dependency',
        },{})),
        // extract css into its own file
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name]/index.[hash:8].css',
            chunkFilename: '[name]/chunk.[id].css'
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                //safe: true,
                map: false,
            }
        }),
        new TransferWebpackPlugin([
            {from: 'images', to: 'static/images'},
            {from: 'html', to: 'static/html'},
            {from: 'js', to: 'static/js'},
            {from: 'css', to: 'static/css'}
        ], path.resolve(__dirname, '../src/static')),
        new FriendlyErrorsPlugin(),
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
                    enforce: true,
                    test: /[\\/]src[\\/]common[\\/]/,
                },
            }
        }
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
