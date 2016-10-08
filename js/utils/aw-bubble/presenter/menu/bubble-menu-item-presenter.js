define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast');

    var BubbleMenuItemPresenter = Protoplast.Object.extend({

        themeController: {
            inject: 'theme-controller'
        },

        init: function() {
            this.view.on('clicked', this.selectSection.bind(this));
        },

        selectSection: function() {
            this.themeController.selectSection(this.view.section);
        }

    });

    return BubbleMenuItemPresenter;
});