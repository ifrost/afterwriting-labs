define(function(require) {

    var template = require('text!templates/plugins/open.hbs'),
        $ = require('jquery'),
        HandlebarComponent = require('utils/handlebar-component');
    
    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            var open = this.plugin;

            var reset_file_input = function() {
                $('#open-file-wrapper').empty();
                $('#open-file-wrapper').html('<input id="open-file" type="file" style="display:none" />');
                $("#open-file").change(function() {
                    var selected_file = $('#open-file').get(0).files[0];
                    open.open_file(selected_file);
                    reset_file_input();
                });
            };

            $('a[open-action="open"]').click(function() {
                open.open_file_dialog()
            });

            $('a[open-action="new"]').click(open.create_new);
            $('a[open-action="sample"]').click(function() {
                var name = $(this).attr('value');
                open.open_sample(name);
            });
            $('a[open-action="last"]').click(open.open_last_used);

            open.open_file_dialog.add(function() {
                $("#open-file").click();
            });

            $('a[open-action="googledrive"]').click(open.open_from_google_drive);
            $('a[open-action="dropbox"]').click(open.open_from_dropbox);

            open.activate.add(function() {
                if (open.is_dropbox_available()) {
                    $('a[open-action="dropbox"]').parent().show();
                } else {
                    $('a[open-action="dropbox"]').parent().hide();
                }

                if (open.is_google_drive_available()) {
                    $('a[open-action="googledrive"]').parent().show();
                } else {
                    $('a[open-action="googledrive"]').parent().hide();
                }
            });

            reset_file_input();
        }

    });

});
