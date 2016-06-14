define(function(require) {
    
    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/info.hbs'),
        common = require('utils/common'),
        off = require('off');

    var Info = Plugin.extend({

        name: 'info',

        title: 'info',

        template: template,

        class: "active",

        $create: function() {
            this.download_clicked = off.signal();
        }
    });

    return Info.create();
});