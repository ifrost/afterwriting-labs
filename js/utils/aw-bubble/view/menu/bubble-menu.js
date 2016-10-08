define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast'),
        BubbleMenuPresenter = require('aw-bubble/presenter/menu/bubble-menu-presenter'),
        BubbleMenuItem = require('aw-bubble/view/menu/bubble-menu-item');

    var BubbleMenu = Protoplast.Component.extend({

        $meta: {
            presenter: BubbleMenuPresenter
        },

        tag: 'ul',

        sections: null,

        $create: function() {
            this.sections = Protoplast.Collection.create();
        },

        init: function() {
            this.root.className = 'selector';
            Protoplast.utils.renderList(this, 'sections', {
                rendererDataProperty: 'section',
                renderer: BubbleMenuItem
            })
        },
        
        animateItem: function(section, attrs, delay) {
            var index = this.sections.toArray().indexOf(section);
            if (this.children[index])
            this.children[index].animate(attrs, delay);
        }

    });

    return BubbleMenu;
});