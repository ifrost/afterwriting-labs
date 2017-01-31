define(function(require) {

    var Protoplast = require('p'),
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
        }
        
    });

    return AppView;
});