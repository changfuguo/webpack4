// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')



var ret = {
    prod: {
        env: require('./prod.env'),
        assetsRoot: path.resolve(__dirname, '../../dist/prod'),
        assetsSubDirectory: '',
        assetsPublicPath: '',
        cssSourceMap: require('./prod.env').NeedSrcMap,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: false,
        usedPWA: true,
        service: {
            scope: '/public/',
            remote:['//static.udache.com', '//webapp.didistatic.com'],
            static:['/static/js/vconsole.min.js', '/static/js/polyfill.min.js']
        }
    },
    dev: {
        env: require('./dev.env'),
        port: 8092,
        assetsRoot: path.resolve(__dirname, '../../dist/dev'),
        autoOpenBrowser: true,
        assetsSubDirectory: '',
        // assetsPublicPath: '',
        // proxyTable: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //         pathRewrite: {'^/api': ''}
        //     }
        // },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: true,
        usedPWA: true,
        service: {
            scope: '/',
            remote:['//10.179.116.215:8089', '//webapp.didistatic.com'],
            static:['/static/js/vconsole.min.js', '/static/js/polyfill.min.js']
        }
    },
    qa: {
    	env: require('./qa.env'),
        assetsRoot: path.resolve(__dirname, '../../dist/qa'),
        assetsSubDirectory: '',
        assetsPublicPath: '',
        cssSourceMap: require('./prod.env').NeedSrcMap,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: false,
        usedPWA: true,
        service: {
            scope: '/',
            remote:['//10.179.116.215:8089', '//webapp.didistatic.com'],
            static:['/static/js/vconsole.min.js', '/static/js/polyfill.min.js']
        }
    }
}
process.env.BUILD_ENV = process.env.BUILD_ENV  || 'dev';
let env = process.env.BUILD_ENV;
let returnEnv = ret[env];
let service = require('../../package').service;
returnEnv.service = Object.assign({}, service, returnEnv.service);
module.exports = returnEnv;
