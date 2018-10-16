var config  = require('./config');
var utils = require('./utils')

var COMMON_PREFIX = 'common';
var VENDOR_PREFIX = 'vendor';
var MANIFEST_PREFIX = 'manifest';
var STATIC_PREFIX = '';

var MODULES = Object.keys(utils.getEntryPages());
var service = config.service;
var url = require('url');
function checkIsModule(key) {
    key = key.split('/');
    key = key[0];
    return MODULES.indexOf(key) > -1;
}

exports.process = function (sw_config) {
    var assets = {
        runtime:[],
        static: [],
        remote: [],
    };


    Object.keys(sw_config).map(function(key){
        let item = sw_config[key];
        if (key.startsWith(COMMON_PREFIX) || key.startsWith(VENDOR_PREFIX) || key.startsWith(MANIFEST_PREFIX) || checkIsModule(key)) {
            item.js && assets.runtime.push(item.js);
            item.css && assets.runtime.push(item.css);
        } else if (key == STATIC_PREFIX) {
            Object.keys(item).map(function(staticKey) {
                if (staticKey != 'html') {
                    assets.static = assets.static.concat(item[staticKey]);
                }
            });
        }
    })
console.log(assets)
    Object.keys(assets).map(function(key) {
        assets[key] = assets[key].map(function(resource) {
            var newResource = resource.substr(0, 3) == '../' ? resource.substr(3) : resource;
            let newPath = url.resolve(service.scope, newResource);
            return newPath;
        })
    });
    return assets;
}
