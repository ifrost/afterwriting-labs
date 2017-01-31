define(function(require) {

    var Protoplast = require('protoplast'),
        MainPresenter = require('aw-bubble/presenter/main-presenter'),
        Logo = require('aw-bubble/view/logo'),
        Background = require('aw-bubble/view/background'),
        Footer = require('aw-bubble/view/footer'),
        Content = require('aw-bubble/view/content'),
        BubbleMenu = require('aw-bubble/view/menu/bubble-menu');

    var Main = Protoplast.Component.extend({

        $meta: {
            presenter: MainPresenter
        },
        
        tooltip: null,

        html: '<div>' +
            '<div data-comp="logo"></div>' +
            '<div data-comp="background"></div>' +
            '<div class="menu"><div data-comp="mainMenu"></div></div>' +
            '<div data-comp="footer"></div>' +
            '<div data-comp="content"></div>' +
            '<div id="tooltip"></div>' +
            '</div>',

        logo: {
            component: Logo
        },

        background: {
            component: Background
        },

        mainMenu: {
            component: BubbleMenu
        },

        footer: {
            component: Footer
        },

        content: {
            component: Content
        },
        
        init: function() {
            Protoplast.utils.bind(this, 'tooltip', this._updateTooltip);
            Protoplast.utils.bind(this, 'tooltip.text', this._updateTooltip);
            Protoplast.utils.bind(this, 'tooltip.x', this._updateTooltipPosition);
            Protoplast.utils.bind(this, 'tooltip.y', this._updateTooltipPosition);
        },
        
        _updateTooltip: function() {
            var text = this.tooltip.text;
            $('#tooltip').css("visibility", !!text ? "visible" : "hidden").html(text);
        },
        
        _updateTooltipPosition: function() {
            $('#tooltip').css("top", (this.tooltip.y - 10) + "px").css("left", (this.tooltip.x + 10) + "px");
        }

    });

    return Main;
});