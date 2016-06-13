define(function(require) {
    
    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/info.hbs'),
        common = require('utils/common'),
        off = require('off');

    var plugin = Plugin.create('info', 'info', template);
    plugin.class = "active";

    plugin.download_clicked = off.signal();

    return plugin;
});