define(function(require) {

    var Protoplast = require('p'),
        BaseSectionViewPresenter = require('aw-bubble/presenter/base-section-view-presenter'),
        IoModel = require('plugin/io/model/io-model'),
        OpenController = require('plugin/io/controller/open-controller');

    /**
     * @extends BaseSectionViewPresenter
     */
    var OpenViewPresenter = BaseSectionViewPresenter.extend({

        openController: {
            inject: OpenController
        },

        ioModel: {
            inject: IoModel
        },

        init: function() {
            Protoplast.utils.bindProperty(this.ioModel, 'lastUsedInfo', this.view, 'lastUsedInfo');

            this.view.on('open-sample', this._openSample);
            this.view.on('create-new', this._createNew);
            this.view.on('open-last-used', this._openLastUsed);
        },
        
        _createNew: function() {
            this.openController.createNew();
            // track
        },

        _openSample: function(name) {
            this.openController.openSample(name);
            // tack
        },
        
        _openLastUsed: function() {
            this.openController.openLastUsed();
            // track
        },
        
        _downloadClicked: function() {
            this.monitor.track('feature', 'download');
        }
        
    });

    return OpenViewPresenter;
});