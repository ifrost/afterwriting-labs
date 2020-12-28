define(function(require) {
    var Switcher = require('theme/aw-bubble/view/switcher'),
        BaseComponent = require('core/view/base-component'),
        MainInfoPresenter = require('core/presenter/main-info-presenter');

    var MainInfo = BaseComponent.extend({

        html: '<div class="appInfo">' +
            '<p><b>’afterwriting</b> turns <a href="https://fountain.io" target="_blank">.fountain</a> screenplays into beautiful PDFs. Free, open-source, offline-first. No registration, no ads, no fuss. ' +
            '<p>Start by using the menu above to <span data-comp="switchToInfo" class="switch" href="#"></span> or <span data-comp="switchToOpen" class="switch" href="#" section="open"></span>.</p>' +
            '<p style="padding-top: 30px"><a href="./privacy.html" target="_blank">Privacy Policy</a> | <a href="./terms.html" target="_blank">Terms of Service</a> | <a href="https://github.com/ifrost/afterwriting-labs" target="_blank">Source Code</a></p></p>' +
            '</div>',

        $meta: {
            presenter: MainInfoPresenter
        },

        switchToInfo: {
            component: Switcher
        },

        switchToOpen: {
            component: Switcher
        },

        addInteractions: function() {
            this.switchToOpen.sectionName = 'open';
            this.switchToOpen.title = "open a new file";

            this.switchToInfo.sectionName = 'info';
            this.switchToInfo.title = "get more details";
        },

        left: {
            set: function(value) {
                this.$root.offset({left: value});
            },
            get: function() {
                return this.$root && this.$root.offset().left;
            }
        },

        outerWidth: {
            get: function() {
                return this.$root ? this.$root.outerWidth() : null;
            }
        },

    });

    return MainInfo;

});