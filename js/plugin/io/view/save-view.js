define(function(require) {

    var Protoplast = require('protoplast'),
        template = require('text!plugin/io/view/save.hbs'),
        $ = require('jquery'),
        BaseComponent = require('core/view/base-component'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin'),
        SaveViewPresenter = require('plugin/io/view/save-view-presenter');
    
    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: SaveViewPresenter
        },
        
        hbs: template,

        displayOpenFromDropbox: false,

        displayOpenFromGoogleDrive: false,

        addBindings: function() {
            Protoplast.utils.bind(this, {
                displayOpenFromDropbox: this._updateOpenFromDropboxVisibility,
                displayOpenFromGoogleDrive: this._updateOpenFromGoogleDriveVisibility
            });
        },

        addInteractions: function() {

            // TODO: make sure plugin's buttons are clicked (other may match the same selector) (+++)
            $('a[action="save-fountain"]').get(0).onclick = this.dispatch.bind(this, 'save-as-fountain');
            $('a[action="save-dropbox-fountain"]').get(0).onclick = this.dispatch.bind(this, 'dropbox-fountain');
            $('a[action="save-gd-fountain"]').get(0).onclick = this.dispatch.bind(this, 'google-drive-fountain');

            $('a[action="save-pdf"]').get(0).onclick = this.dispatch.bind(this, 'save-as-pdf');
            $('a[action="save-dropbox-pdf"]').get(0).onclick = this.dispatch.bind(this, 'dropbox-pdf');
            $('a[action="save-gd-pdf"]').get(0).onclick = this.dispatch.bind(this, 'google-drive-pdf');
        },

        _updateOpenFromDropboxVisibility: function() {
            if (this.displayOpenFromDropbox) {
                // TODO: All the queries should be local, not global (+++)
                $('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().show();
            } else {
                $('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().hide();
            }
        },

        _updateOpenFromGoogleDriveVisibility: function() {
            if (this.displayOpenFromGoogleDrive) {
                $('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().show();
            } else {
                $('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().hide();
            }
        }

    });

});
