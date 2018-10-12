var path = require('path'), fs = require('fs');
var config = require('./config')
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')

exports.assetsPath = function (_path) {
    var assetsSubDirectory = config.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loaders, loaderOptions) {
        var rules = ['vue-style-loader', cssLoader]
        if (loaders) {
        	loaders.map((loader) => {
        		rules.push({
	                loader: loader + '-loader',
	                options: Object.assign({}, loaderOptions, {
	                    sourceMap: options.sourceMap
	                })
	            })
        	})
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)

        if (options.extract) {
            rules.splice(1, 0, MiniCssExtractPlugin.loader)
        }
        return rules
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders(['less']),
        sass: generateLoaders(['sass'], {indentedSyntax: true}),
        scss: generateLoaders(['postcss','sass']),
        stylus: generateLoaders(['stylus']),
        styl: generateLoaders(['stylus'])
    }
}

// Generate rules for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    var output = []
    var rules = exports.cssLoaders(options)
    for (var extension in rules) {
        var loader = rules[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

//遍历pages文件夹生成入口
const pagesPath = './src/modules';
exports.getEntryPages = function () {
    var r = {};
    var entrieFiles = fs.readdirSync(pagesPath);
    entrieFiles.forEach(dir => {
       	var entry = dir + '/index.js';
        r[dir] = pagesPath + '/' + entry;
    })
    return r;
}

exports.htmlPlugins = function (webackConfig) {

    var list = Object.keys(webackConfig.entry).map(baseName => {
    	 var exChunks = config.env.BUILD_ENV !='dev' ? ['manifest/' + baseName, 'vendor', 'common'] : [];
        return htmlPlugin({
            filename: baseName + '/index.html',
            chunks: [...exChunks, baseName],
            module: baseName,
            dev: config.isBuild ? 'prod' : 'dev'
        })
    })
    return list
}
exports.getIPAdress = function(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.address;
               }
          }
    }
}
function htmlPlugin(exConfig) {
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin

    return new HtmlWebpackPlugin(Object.assign({
        template: './src/views/' + exConfig.module + '.ejs',
        inject: true,
        env: process.env.BUILD_ENV
        // minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: false
        //     // more options:
        //     // https://github.com/kangax/html-minifier#options-quick-reference
        // },
        // chunksSortMode: 'dependency',
    }, exConfig))
}
