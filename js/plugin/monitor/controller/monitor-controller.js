define(function(require) {

    var Protoplast = require('p');

    var MonitorController = Protoplast.Object.extend({

        monitor: {
            inject: 'monitor'
        },
        
        downloadLinkClicked: {
            sub: 'info/download-link/clicked',
            value: function() {
                this.monitor.track('feature', 'download');
            }
        },

        themeSectionDescriptionShown: {
            sub: 'aw-bubble/section-header/description/shown',
            value: function(sectionId) {
                this.monitor.track('feature', 'help', sectionId);
            }
        },

        themeBackgroundClicked: {
            sub: 'aw-bubble/background/clicked',
            value: function(lastSectionName) {
                this.monitor.track('navigation', 'back-close', lastSectionName);
            }
        },

        themeCloseCurrentContent: {
            sub: 'aw-bubble/top-menu/close',
            value: function(lastSectionName) {
                this.monitor.track('navigation', 'toolbar-close', lastSectionName);
            }
        },

        themeExpandContent: {
            sub: 'aw-bubble/top-menu/expand',
            value: function() {
                this.monitor.track('feature', 'expand');
            }
        },

        themeMainMenuItemSelected: {
            sub: 'aw-bubble/main-menu/item/selected',
            value: function(sectionName) {
                this.monitor.track('navigation', sectionName, 'main');
            }
        },

        themeTopMenuItemSelected: {
            sub: 'aw-bubble/top-menu/item/selected',
            value: function(sectionName) {
                this.monitor.track('navigation', sectionName, 'toolbar');
            }
        },

        appSwitchToSection: {
            sub: 'app/switch-link',
            value: function(sectionName) {
                this.monitor.track('navigation', sectionName, 'switcher');
            }
        }
        
    });

    return MonitorController;
});