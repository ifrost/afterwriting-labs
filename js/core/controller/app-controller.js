define(function(require) {

    var common = require('utils/common'),
        Protoplast = require('p'),
        AppModel = require('core/model/app-model'),
        ThemeModel = require('aw-bubble/model/theme-model'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var AppController = Protoplast.Object.extend({

        appModel: {
            inject: 'appModel'
        },
        
        themeModel: {
            inject: ThemeModel
        },

        themeController: {
            inject: ThemeController
        },

        pub: {
            inject: 'pub'
        },
        
        init: function() {
            this.appModel.urlParams = this._parseUrlParams();
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
        },
        
        _parseUrlParams: function() {
            var urlParams = {};

            if (window && window.location && window.location.search) {
                window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
                    urlParams[key] = value;
                });
            }
            
            return urlParams;
        }

    });

    return AppController;
});