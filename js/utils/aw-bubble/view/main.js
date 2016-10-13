define(function(require) {

    var Protoplast = require('p'),
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
        }
    });

    return Main;
});