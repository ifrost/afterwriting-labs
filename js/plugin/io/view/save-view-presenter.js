define(function(require) {

    var Protoplast = require('p'),
        IoModel = require('plugin/io/model/io-model'),
        SaveController = require('plugin/io/controller/save-controller');

    var SaveViewPresenter = Protoplast.Object.extend({

        pub: {
            inject: 'pub'
        },

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
            this.pub('plugin/io/save-fountain-locally');
        },

        _saveFountainToDropbox: function() {
            this.saveController.saveFountainToDropbox();
            this.pub('plugin/io/save-fountain-dropbox');
        },

        _saveFountainToGoogleDrive: function() {
            this.saveController.saveFountainToGoogleDrive();
            this.pub('plugin/io/save-fountain-google-drive');
        },

        _savePdfLocally: function() {
            this.saveController.savePdfLocally();
            this.pub('plugin/io/save-pdf-locally');
        },

        _savePdfToDropbox: function() {
            this.saveController.savePdfToDropbox();
            this.pub('plugin/io/save-pdf-dropbox');
        },

        _savePdfToGoogleDrive: function() {
            this.saveController.savePdfToGoogleDrive();
            this.pub('plugin/io/save-pdf-google-drive');
        }
    });

    return SaveViewPresenter;
});