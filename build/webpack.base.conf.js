var path = require('path')
var utils = require('./utils')
var config = require('./config')
var vueLoaderConfig = require('./vue-loader.conf')
var {VueLoaderPlugin} = require('vue-loader');
var AssetsPlugin = require('assets-webpack-plugin')
var fs = require('fs')
var ProcessSWOutput = require('./process.sw');
var SW_CONFIG_NAME = "sw_config." + config.service.version+ ".js"
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    entry: utils.getEntryPages(),
    output: {
        path: config.assetsRoot,
        filename: '[name].js',
        publicPath: config.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'images': resolve('src/static/images'),
            'lib': resolve('src/common/lib'),
            'sass': resolve('src/common/sass')
        }
    },
    // target:"node",

    module: {
        rules: [
            // {
            //   test: /\.(js|vue)$/,
            //   loader: 'eslint-loader',
            //   enforce: 'pre',
            //   include: [resolve('src'), resolve('test')],
            //   options: {
            //     formatter: require('eslint-friendly-formatter')
            //   }
            // },
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

    ].concat(config.usedPWA ?  new AssetsPlugin({
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
        }): []),

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
        child_process: 'empty',
        __filename: false,
        __dirname: false
    }
}
