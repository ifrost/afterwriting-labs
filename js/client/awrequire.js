var path = require('path');
var Module = require('module');

var _require = require;

var config = {};

/**
 * Resolve require.js module name to node.js name
 */
var resolve_module_name = function(name) {
    var root = __dirname,
        fragments = name.split('/'),
        path_parts = [root, '..'].concat(fragments),
        module_path = path.join.apply(null, path_parts);
    return module_path + '.js';
};

/**
 * modified require
 */
require = function() {
    var name = arguments[0];

    if (config.use_node_require && config.use_node_require.indexOf(name) != -1) {
        return _require(name);
    } else if (config.map[name]) {
        if (typeof (config.map[name]) === "string") {
            name = config.map[name];
        } else {
            return config.map[name];
        }
    }

    var module_path = resolve_module_name(name);
    var result = _require.call(this, module_path);
    return result;
}.bind(this);

/**
 * config setter
 * supported options:
 *  map - allows to override module definition or name
 *  use_node_require - list of modules that should keep using node require.js
 */
require.config = function(value) {
    config = value;
};

/**
 * modified define
 */
global.define = function(name, definition) {
    var exp = definition(require);
    Module._cache[resolve_module_name(name)].exports = exp;
};

module.exports = require;