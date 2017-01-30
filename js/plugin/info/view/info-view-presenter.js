define(function(require) {

    var Protoplast = require('p'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var InfoViewPresenter = Protoplast.Object.extend({

        pub: {
            inject: 'pub'
        },

        themeController: {
            inject: ThemeController
        },

        init: function() {
            this.view.on('download-clicked', this._downloadClicked, this);
            this.view.on('switch-to-open', this._switchToOpen, this);
        },
        
        _downloadClicked: function() {
            this.pub('info/download-link/clicked');
        },
        
        _switchToOpen: function() {
            this.themeController.selectSectionByName('open');
            this.pub('app/switch-link', 'open');
        }
        
    });

    return InfoViewPresenter;
});