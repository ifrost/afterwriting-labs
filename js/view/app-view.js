define(function(require) {

    var Protoplast = require('protoplast'),
        AppViewPresenter = require('view/app-view-presenter'),
        BubbleTheme = require('aw-bubble/view/main');

    var AppView = Protoplast.Component.extend({
        
        $meta: {
            presenter: AppViewPresenter
        },
        
        html: '<div><div data-comp="theme"></div></div>',
        
        theme: {
            component: BubbleTheme
        },

        init: function() {
            $('#loader').remove();
        },

        destroy: function() {
            Protoplast.Component.destroy.call(this);
            $.jstree.destroy();
            var box = $.prompt.getBox();
            if (box) {
                box.remove();
            }
        }
        
    });

    return AppView;
});