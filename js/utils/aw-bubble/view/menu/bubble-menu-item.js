define(function(require) {

    var $ = require('aw-bubble/vendor/jquery'),
        Protoplast = require('aw-bubble/vendor/protoplast'),
        BubbleMenuItemPresenter = require('aw-bubble/presenter/menu/bubble-menu-item-presenter');

    var BubbleMenuItem = Protoplast.Component.extend({
        
        $meta: {
            presenter: BubbleMenuItemPresenter
        },
        
        html: '<li>' +
            '<img data-prop="$icon" />' +
            '<span data-prop="$title"></span>' +
        '</li>',
        
        section: null,

        $icon: null,

        $title: null,

        $create: function() {
            this.$root = $(this.root);

            this.$root.hover(function() {
                $(this).addClass('menu-item-hover');
            }, function() {
                $(this).removeClass('menu-item-hover');
            });

            this.$root.offset({
                top: $(window).height() / 2,
                left: $(window).width() / 2
            }).css({
                'opacity': 0
            });
            
            this.root.onclick = this.dispatch.bind(this, 'clicked');
        },
        
        init: function() {
            Protoplast.utils.bind(this, 'section.name', this.render.bind(this));
            Protoplast.utils.bind(this, 'section.smallIcon', this.renderIcon.bind(this));
            Protoplast.utils.bind(this, 'section.shortTitle', this.renderTitle.bind(this));
        },
        
        render: function() {
            this.root.className = 'menu-item ' + this.section.name;
        },

        renderIcon: function() {
            this.$icon.setAttribute('src', this.section.smallIcon);
        },

        renderTitle: function() {
            this.$title.innerHTML = this.section.shortTitle;
        },
        
        animate: function(attrs, delay) {
            this.$root.animate(attrs, delay);
        },

        stopAnimation: function() {
            this.$root.stop();
        }
        
    });

    return BubbleMenuItem;
});