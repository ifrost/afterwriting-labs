define(function(require) {

    var Protoplast = require('p'),
        template = require('text!plugin/io/view/open.hbs'),
        OpenViewPresenter = require('plugin/io/view/open-view-presenter'),
        $ = require('jquery'),
        HandlebarComponent = require('utils/handlebar-component');
    
    return HandlebarComponent.extend({

        $meta: {
            presenter: OpenViewPresenter
        },
        
        hbs: template,
        
        lastUsedInfo: null,
        
        init: function() {
            HandlebarComponent.init.call(this);
            Protoplast.utils.bind(this, 'lastUsedInfo', this._updateLastUsedInfo);
        },
        
        addInteractions: function() {

            var self = this;

            $('a[open-action="new"]').click(self.dispatch.bind(this, 'create-new'));
            
            $('a[open-action="sample"]').click(function() {
                var name = $(this).attr('value');
                self.dispatch('open-sample', name);
            });

            $('a[open-action="last"]').click(self.dispatch.bind(this, 'open-last-used'));
            $('a[open-action="dropbox"]').click(self.dispatch.bind(this, 'open-from-dropbox'));
            $('a[open-action="googledrive"]').click(self.dispatch.bind(this, 'open-from-google-drive'));

/*
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
       

            open.open_file_dialog.add(function() {
                $("#open-file").click();
            });

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
*/
        },

        $lastUsed: null,

        $lastUsedTitle: null,

        $lastUsedDate: null,

        _updateLastUsedInfo: function() {
            if (this.lastUsedInfo) {
                this.$lastUsed.style.display = 'block';
                this.$lastUsedTitle.innerHTML = this.lastUsedInfo.title;
                this.$lastUsedDate.innerHTML = this.lastUsedInfo.date;
            }
            else {
                this.$lastUsed.style.display = 'none';
            }
        }
        
    });

});
