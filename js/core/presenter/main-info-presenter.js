define(function(require) {
    var Protoplast = require('protoplast'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller'),
        ThemeModel = require('theme/aw-bubble/model/theme-model');

    var MainInfoPresenter = Protoplast.Object.extend({

        scriptModel: {
            inject: 'script'
        },

        themeController: {
            inject: ThemeController
        },

        themeModel: {
            inject: ThemeModel
        },

        init: function() {
            Protoplast.utils.bind(this.scriptModel, 'script', function(){
                this.themeController.setMainInfoComponent(null);
            }.bind(this));

            Protoplast.utils.bind(this, 'themeModel.height', this.updateContentSize.bind(this));
            Protoplast.utils.bind(this, 'themeModel.width', this.updateContentSize.bind(this));
        },

        updateContentSize: function() {
            this.view.left = (this.themeModel.width - this.view.outerWidth) / 2;
        }

    });

    return MainInfoPresenter;
});