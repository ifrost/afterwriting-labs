define(function(require) {

    var BaseSectionViewPresenter = require('theme/aw-bubble/presenter/base-section-view-presenter'),
        IoModel = require('plugin/io/model/io-model'),
        SaveController = require('plugin/io/controller/save-controller');

    var EditViewMenuPresenter = BaseSectionViewPresenter.extend({

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
            BaseSectionViewPresenter.init.call(this);

            this.view.on('save-as-fountain', this._saveFountainLocally);
            this.view.on('dropbox-fountain', this._saveFountainToDropbox);
            this.view.on('google-drive-fountain', this._saveFountainToGoogleDrive);
        },
        
        activate: function() {
            BaseSectionViewPresenter.activate.call(this);

            this.view.displayOpenFromDropbox = this.ioModel.isDropboxAvailable;
            this.view.displayOpenFromGoogleDrive = this.ioModel.isGoogleDriveAvailable;
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
        }

    });

    return EditViewMenuPresenter;
});