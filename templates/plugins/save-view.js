define(function(require) {

    var template = require('text!templates/plugins/save.hbs'),
        $ = require('jquery'),
        HandlebarComponent = require('utils/handlebar-component');
    
    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            var save = this.plugin;
            
            $(document).ready(function() {
                $('a[action="save-fountain"]').click(save.save_as_fountain);
                $('a[action="save-dropbox-fountain"]').click(save.dropbox_fountain);
                $('a[action="save-gd-fountain"]').click(save.google_drive_fountain);

                $('a[action="save-pdf"]').click(save.save_as_pdf);
                $('a[action="save-dropbox-pdf"]').click(save.dropbox_pdf);
                $('a[action="save-gd-pdf"]').click(save.google_drive_pdf);

                save.activate.add(function() {
                    if (!save.is_dropbox_available()) {
                        $('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().hide();
                    } else {
                        $('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().show();
                    }
                    if (!save.is_google_drive_available()) {
                        $('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().hide();
                    } else {
                        $('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().show();
                    }
                });


            });

        }

    });

});
