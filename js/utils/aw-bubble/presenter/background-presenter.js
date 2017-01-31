define(function(require) {

    var Protoplast = require('protoplast'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        ThemeModel = require('aw-bubble/model/theme-model');

    var BackgroundPresenter = Protoplast.Object.extend({

        pub: {
            inject: 'pub'
        },

        themeController: {
            inject: ThemeController
        },

        themeModel: {
            inject: ThemeModel
        },
        
        init: function() {
            this.view.on('clicked', this.clearSelectedSection.bind(this));
        },
        
        clearSelectedSection: function() {
            var currentSection = this.themeModel.sections.selected;
            if (currentSection) {
                this.themeController.clearSelectedSection();
                this.pub('aw-bubble/background/clicked', currentSection.name);
            }
        }
        
    });

    return BackgroundPresenter;
});