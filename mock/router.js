/**
*   @description 统一的路由配置
*/
var path = require('path');
var fs = require('fs');
var MOCK_DIR = path.join(__dirname, './')
var ROUTE_CONFIG = require('./config');
module.exports = function(router) {

	Object.keys(ROUTE_CONFIG).forEach(function (value, index) {

		var routerItem = ROUTE_CONFIG[value];
		var method = routerItem.method || 'get';
		var filename = routerItem.filename;
		var filePath = routerItem.filename ? path.join(MOCK_DIR, filename) : path.join(MOCK_DIR, value);
		filePath = filePath + '.js';
		if (fs.existsSync(filePath)) {
			var mocker = require(filePath);
			router[method](value, function(req, res, next){
				console.log(value);
				mocker(req, res, next)
			})
		} else {
			console.log('filename is not exists [' + filePath+ ']');
		}
	})
}
