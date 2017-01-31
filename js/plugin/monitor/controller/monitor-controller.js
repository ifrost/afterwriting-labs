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

        themeSwitchToSection: {
            sub: 'aw-bubble/switcher/clicked',
            value: function(sectionName) {
                this.monitor.track('navigation', sectionName, 'switcher');
            }
        },

        openCreateNew: {
            sub: 'plugin/io/create-new',
            value: function() {
                this.monitor.track('feature', 'open-new');
            }
        },

        openLastUsed: {
            sub: 'plugin/io/open-last-used',
            value: function() {
                this.monitor.track('feature', 'open-last-used', 'manual');
            }
        },

        openLastUsedStartup: {
            sub: 'plugin/io/startup/opened-last-used',
            value: function() {
                this.monitor.track('feature', 'open-last-used', 'startup');
            }
        },

        openSample: {
            sub: 'plugin/io/open-sample',
            value: function(sampleName) {
                this.monitor.track('feature', 'open-sample', sampleName);
            }
        },

        openDialog: {
            sub: 'plugin/io/open-local-file-dialog',
            value: function() {
                this.monitor.track('feature', 'open-file-dialog');
            }
        },

        openFromDropbox: {
            sub: 'plugin/io/opened-from-dropbox',
            value: function(format) {
                this.monitor.track('feature', 'open-dropbox', format);
            }
        },

        openFromGoogleDrive: {
            sub: 'plugin/io/opened-from-google-drive',
            value: function(format) {
                this.monitor.track('feature', 'open-googledrive', format);
            }
        }
        
    });

    return MonitorController;
});