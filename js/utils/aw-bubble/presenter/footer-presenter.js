define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast');

    var FooterPresenter = Protoplast.Object.extend({
        
        themeModel: {
            inject: 'theme-model'
        },
        
        init: function() {
            Protoplast.utils.bindProperty(this, 'themeModel.footer', this.view, 'content');
        }
        
    });

    return FooterPresenter;
});