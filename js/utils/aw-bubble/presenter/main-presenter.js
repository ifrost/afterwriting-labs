define(function(require) {

    var $ = require('aw-bubble/vendor/jquery'),
        Protoplast = require('aw-bubble/vendor/protoplast');

    var MainPresenter = Protoplast.extend({

        themeModel: {
            inject: 'theme-model'
        },

        init: {
            injectInit: true,
            value: function() {
                this.themeModel.width = $('html').width();
                this.themeModel.height =  $(document).height();
                $(window).resize(function() {
                    this.themeModel.width = $('html').width();
                    this.themeModel.height =  $(document).height();
                }.bind(this));
            }
        }

    });

    return MainPresenter;
});