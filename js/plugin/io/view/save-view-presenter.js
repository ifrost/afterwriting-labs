define(function(require) {

    var Protoplast = require('p'),
        IoModel = require('plugin/io/model/io-model'),
        SaveController = require('plugin/io/controller/save-controller');

    var SaveViewPresenter = Protoplast.Object.extend({
        
        saveController: {
            inject: SaveController
        },

        ioModel: {
            inject: IoModel
        },
        
        init: function() {
            Protoplast.utils.bindProperty(this.ioModel, 'isDropboxAvailable', this.view, 'displayOpenFromDropbox');
            Protoplast.utils.bindProperty(this.ioModel, 'isGoogleDriveAvailable', this.view, 'displayOpenFromGoogleDrive');

            this.view.on('save-as-fountain', this._saveFountainLocally);
            this.view.on('dropbox-fountain', this._saveFountainToDropbox);
            this.view.on('google-drive-fountain', this._saveFountainToGoogleDrive);

            this.view.on('save-as-pdf', this._savePdfLocally);
            this.view.on('dropbox-pdf', this._savePdfToDropbox);
            this.view.on('google-drive-pdf', this._savePdfToGoogleDrive);
        },

        _saveFountainLocally: function() {
            this.saveController.saveFountainLocally();
        },

        _saveFountainToDropbox: function() {
            this.saveController.saveFountainToDropbox();
        },

        _saveFountainToGoogleDrive: function() {
            this.saveController.saveFountainToGoogleDrive();
        },

        _savePdfLocally: function() {
            this.saveController.savePdfLocally();
        },

        _savePdfToDropbox: function() {
            this.saveController.savePdfToDropbox();
        },

        _savePdfToGoogleDrive: function() {
            this.saveController.savePdfToGoogleDrive();
        }
    });

    return SaveViewPresenter;
});