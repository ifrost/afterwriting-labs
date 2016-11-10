define(function(require) {

    var Protoplast = require('p'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var BackgroundPresenter = Protoplast.Object.extend({
        
        themeController: {
            inject: ThemeController
        },
        
        init: function() {
            this.view.on('clicked', this.clearSelectedSection.bind(this));
        },
        
        clearSelectedSection: function() {
            this.themeController.clearSelectedSection();
        }
        
    });

    return BackgroundPresenter;
});