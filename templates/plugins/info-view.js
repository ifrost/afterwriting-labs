define(function(require) {

    var template = require('text!templates/plugins/info.hbs'),
        $ = require('jquery'),
        HandlebarComponent = require('utils/handlebar-component');
    
    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            $('#download-link').click(this.plugin.download_clicked);
        }

    });

});
