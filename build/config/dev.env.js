var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BUILD_ENV: '"dev"',
    NeedSrcMap: true, //需要源码映射
})
