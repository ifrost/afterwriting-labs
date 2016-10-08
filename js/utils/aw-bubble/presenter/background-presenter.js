define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast');

    var BackgroundPresenter = Protoplast.Object.extend({
        
        themeController: {
            inject: 'theme-controller'
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