var Protoplast = require('protoplast');
var fs = require('fs');

var ConfigLoader = Protoplast.extend({

    _applyOverrides: function(config, overrides) {
        overrides.forEach(function(override) {
            var firstEq = override.indexOf('=');
            if (firstEq !== -1) {
                var setting = override.slice(0, firstEq);
                var value = override.slice(firstEq + 1);
                if (value === 'true') {
                    value = true
                }
                if (value === 'false') {
                    value = false;
                }

                var path = setting.split('.');
                var node = config;
                while (path.length > 1) {
                    var parent = path.shift();
                    node[parent] = node[parent] || {};
                    node = node[parent];
                }
                node[path[0]] = value;
            }
        });
    },
    
    loadFromFile: function(config, overrides, callback) {
        var result = {};
        overrides = overrides || [];
        if (!Array.isArray(overrides)) {
            overrides = [overrides];
        }
        if (config) {
            console.log('Loading config...', config);
            fs.readFile(config, 'utf8', function (err, data) {
                if (err) {
                    console.error('Cannot open config file', config);
                } else {
                    result = JSON.parse(data);
                }
                this._applyOverrides(result, overrides);
                callback(result);
            }.bind(this));
        }
        else {
            this._applyOverrides(result, overrides);
            callback(result);
        }
    }
    
});

module.exports = ConfigLoader;
