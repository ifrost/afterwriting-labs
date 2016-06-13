define(function(require) {

    var Plugin = require('core/plugin');
    
    var module = {};
    
    module.create_plugin = function(name, title, template) {
        return Plugin.create(name, title, template);
    };
    
    return module;
});