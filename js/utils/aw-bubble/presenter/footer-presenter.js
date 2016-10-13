define(function(require) {

    var Protoplast = require('p');

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