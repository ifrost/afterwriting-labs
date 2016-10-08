define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast'),
        TopMenuPresenter = require('aw-bubble/presenter/menu/top-menu-presenter'),
        TopMenuItem = require('aw-bubble/view/menu/top-menu-item');

    var TopMenu = Protoplast.Component.extend({

        $meta: {
            presenter: TopMenuPresenter
        },

        html: '<div class="top-bar">' +
        '<div><img data-prop="closeIcon" class="close-content panel-icon" src="gfx/icons/close.svg" /><img data-prop="expandIcon" class="expand panel-icon" src="gfx/icons/expand.svg" /></div>' +
        '</div>',
        
        sections: null,

        $create: function() {
            this.sections = Protoplast.Collection.create();
            this.closeIcon.onclick = this.dispatch.bind(this, 'close');
            this.expandIcon.onclick = this.dispatch.bind(this, 'expand');
        },

        init: function() {
            Protoplast.utils.renderList(this, 'sections', {
                rendererDataProperty: 'section',
                renderer: TopMenuItem
            })
        },

        setSelected: function(section) {
            this.children.forEach(function(topMenuItem) {
                topMenuItem.selected = topMenuItem.section === section;
            })
        }

    });

    return TopMenu;
});