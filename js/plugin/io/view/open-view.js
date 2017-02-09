define(function(require) {

    var Protoplast = require('protoplast'),
        template = require('text!plugin/io/view/open.hbs'),
        OpenViewPresenter = require('plugin/io/view/open-view-presenter'),
        $ = require('jquery'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin'),
        BaseComponent = require('core/view/base-component');
    
    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: OpenViewPresenter
        },
        
        hbs: template,
        
        lastUsedInfo: null,

        displayOpenFromDropbox: false,

        displayOpenFromGoogleDrive: false,

        addBindings: function() {
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

            this.onClick('a[open-action="last"]', self.dispatch.bind(this, 'open-last-used'));
            this.onClick('a[open-action="dropbox"]', self.dispatch.bind(this, 'open-from-dropbox'));
            this.onClick('a[open-action="googledrive"]', self.dispatch.bind(this, 'open-from-google-drive'));

            this._resetFileInput();

            $("#open-file").change(function() {
                var selected_file = $('#open-file').get(0).files.item(0);
                this.dispatch('open-file', selected_file);
                this._resetFileInput();
            }.bind(this));

            this.onClick('a[open-action="open"]', function() {
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
