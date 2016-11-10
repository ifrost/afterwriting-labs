define(function(require) {

    var common = require('utils/common'),
        Protoplast = require('p'),
        ThemeModel = require('aw-bubble/model/theme-model'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var AppController = Protoplast.Object.extend({

        themeModel: {
            inject: ThemeModel
        },

        themeController: {
            inject: ThemeController
        },

        pub: {
            inject: 'pub'
        },

        initialiseApp: {
            sub: 'app/init',
            value: function() {

                var footer = common.data.footer;
                if (window.hasOwnProperty('ENVIRONMENT') && window.ENVIRONMENT == 'dev') {
                    footer += '<br /><span class="version">development version</span>';
                }
                this.themeController.setFooter(footer);

                this.pub('bubble-theme/init');
            }
        }

    });

    return AppController;
});