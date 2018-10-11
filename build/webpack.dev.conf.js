var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var argv = require('yargs').argv;
// 获取当前要启动的入口文件 格式如下 -m = approve, mock

function KeepEntry() {
	var newEntries = {};
	var modules = (argv.m || '').split(',');
    modules = modules.filter(function(module) {
        return module.replace(/\s+/, '') != '';
    });
	var entries = baseWebpackConfig.entry;
	//有特定的modules
	if (modules.length > 0) {
		modules.map((module) => {
            console.log('module:' + module);
			if (entries[module]) {
				newEntries[module] = entries[module];
			}
		})
		baseWebpackConfig.entry =  newEntries;
	}
}
KeepEntry();
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
	output: {
		path: config.assetsRoot,
        publicPath: '/'
	},
    mode: "development",
    module: {
        rules: utils.styleLoaders({sourceMap: config.cssSourceMap})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        ...utils.htmlPlugins(baseWebpackConfig),
        new FriendlyErrorsPlugin(),
    ],
    optimization: {
        runtimeChunk: false,
        minimize: false,
        noEmitOnErrors: true,
        splitChunks: false
    },
})
