define(function(require) {

    var BaseComponent = require('core/view/base-component'),
        TopMenuPresenter = require('theme/aw-bubble/presenter/menu/top-menu-presenter'),
        TopMenuItem = require('theme/aw-bubble/view/menu/top-menu-item');

    var TopMenu = BaseComponent.extend({

        $meta: {
            presenter: TopMenuPresenter
        },

        html: '<div class="top-bar">' +
        '<div><img data-prop="$closeIcon" class="content-action" src="gfx/icons/close.svg" /><img data-prop="$expandIcon" class="content-action" src="gfx/icons/expand.svg" /></div>' +
        '</div>',

        $closeIcon: null,

        $expandIcon: null,

        sections: {
            renderWith: {
                property: 'section',
                renderer: TopMenuItem
            }
        },

        $create: function() {
            this.$closeIcon.click(this.dispatch.bind(this, 'close'));
            this.$expandIcon.click(this.dispatch.bind(this, 'expand'));
        },

        setSelected: function(section) {
            this.children.forEach(function(topMenuItem) {
                topMenuItem.selected = topMenuItem.section === section;
            });
        }

    });

    return TopMenu;
});