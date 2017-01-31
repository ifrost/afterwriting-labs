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

        displayOpenFromDropbox: false,

        displayOpenFromGoogleDrive: false,

        init: function() {
            HandlebarComponent.init.call(this);
            Protoplast.utils.bind(this, {
                lastUsed: this._updateLastUsedInfo,
                displayOpenFromDropbox: this._updateOpenFromDropboxVisibility,
                displayOpenFromGoogleDrive: this._updateOpenFromGoogleDriveVisibility
            });
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

            this._resetFileInput();

            $("#open-file").change(function() {
                var selected_file = $('#open-file').get(0).files.item(0);
                this.dispatch('open-file', selected_file);
                this._resetFileInput();
            }.bind(this));

            $('a[open-action="open"]').click(function() {
                this.dispatch('open-file-dialog');
                $("#open-file").click();
            }.bind(this));
        },

        $lastUsed: null,

        $lastUsedTitle: null,

        $lastUsedDate: null,

        _resetFileInput: function() {
            $('#open-file-wrapper').empty()
                .html('<input id="open-file" type="file" style="display:none" />');
        },

        _updateOpenFromDropboxVisibility: function() {
            if (this.displayOpenFromDropbox) {
                $('a[open-action="dropbox"]').parent().show();
            } else {
                $('a[open-action="dropbox"]').parent().hide();
            }
        },

        _updateOpenFromGoogleDriveVisibility: function() {
            if (this.displayOpenFromGoogleDrive) {
                $('a[open-action="googledrive"]').parent().show();
            } else {
                $('a[open-action="googledrive"]').parent().hide();
            }
        },

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
