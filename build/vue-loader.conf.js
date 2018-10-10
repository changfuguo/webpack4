var utils = require('./utils')
var config = require('./config')

var srcMap = config.cssSourceMap;
module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: srcMap,
        extract: !srcMap
    })
}
