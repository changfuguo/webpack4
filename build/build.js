//生成主题颜色变量，供生成过程中使用
// require('./make-element-theme.js')(null, true);

require('./check-versions')()
var config = require('./config')
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var fs = require('fs');
var spinner = ora('building for ' + process.env.NODE_ENV + '...')
spinner.start()

function doWebpack(onEnd) {

    webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        onEnd(err);

        if (err) {
            throw err
        }
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
}

doWebpack(function() {})
