define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast'),
        BackroundPresenter = require('aw-bubble/presenter/background-presenter');

    var Background = Protoplast.Component.extend({
        
        $meta: {
            presenter: BackroundPresenter
        },
        
        html: '<div id="back" style="opacity:0; width: 100%; height: 100%; position: absolute; top: 0; left: 0"></div>',
        
        init: function() {
            this.root.onclick = this.dispatch.bind(this, 'clicked');
        }
        
    });

    return Background;
});