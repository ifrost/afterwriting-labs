define(function(require) {

    var Protoplast = require('p'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var TopMenuItemPresenter = Protoplast.Object.extend({

        themeController: {
            inject: ThemeController
        },

        init: function() {
            this.view.on('clicked', this.selectSection.bind(this));
        },

        selectSection: function() {
            this.themeController.selectSection(this.view.section);
        }

    });

    return TopMenuItemPresenter;
});