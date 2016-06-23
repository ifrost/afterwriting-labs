/*jshint -W069 */
define(function(require) {

    var logger = require('logger'),
        Module = require('core/module');

    var Monitor = Module.extend({

        name: 'monitor',
        
        info: {
            inject: 'info'
        },
        
        open: {
            inject: 'open'
        },
        
        save: {
            inject: 'save'
        },
        
        editor: {
            inject: 'editor'
        },

        stats: {
            inject: 'stats'
        },
        
        layout: {
            inject: 'layout'
        },

        prepare: function() {
            if (window.location.protocol !== 'file:') {
                (function(i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function() {
                            (i[r].q = i[r].q || []).push(arguments);
                        };
                    i[r].l = 1 * new Date();
                    a = s.createElement(o);
                    m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m);
                })(window, document, 'script', 'http://www.google-analytics.com/analytics.js', 'ga');

                ga('create', 'UA-53953908-1', 'auto');
                ga('send', 'pageview');
            }
        },

        windup: function() {
            // layout stats
            this.layout.scopes.toolbar_switch_to.add(function(plugin) {
                this.track_event('navigation', plugin.name, 'toolbar');
            }.bind(this));
            this.layout.scopes.main_switch_to.add(function(plugin) {
                this.track_event('navigation', plugin.name, 'main');
            }.bind(this));
            this.layout.scopes.switcher_switch_to.add(function(plugin) {
                this.track_event('navigation', plugin.name, 'switcher');
            }.bind(this));
            this.layout.scopes.toolbar_close_content.add(function(plugin) {
                this.track_event('navigation', 'toolbar-close', plugin.name);
            }.bind(this));
            this.layout.scopes.back_close_content.add(function(plugin) {
                this.track_event('navigation', 'back-close', plugin.name);
            }.bind(this));
            this.layout.info_opened.add(function(section) {
                this.track_event('feature', 'help', section);
            }.bind(this));
            this.layout.toggle_expand.add(this.track_handler('feature', 'expand'));

            // info
            this.info.download_clicked.add(this.track_handler('feature', 'download'));

            // open
            this.open.open_sample.add(function(result) {
                this.track_event('feature', 'open-sample', result);
            }.bind(this));

            this.open.create_new.add(this.track_handler('feature', 'open-new'));
            this.open.open_file_dialog.add(this.track_handler('feature', 'open-file-dialog'));
            this.open.open_file.add(function(format) {
                this.track_event('feature', 'open-file-opened', format);
            }.bind(this));
            this.open.open_from_dropbox.add(function(format) {
                this.track_event('feature', 'open-dropbox', format);
            }.bind(this));
            this.open.open_from_google_drive.add(function(format) {
                this.track_event('feature', 'open-googledrive', format);
            }.bind(this));
            this.open.open_last_used.add(function(startup) {
                this.track_event('feature', 'open-last-used', startup === true ? 'startup' : 'manual');
            }.bind(this));

            // editor
            this.editor.synced.add(function(cloud) {
                this.track_event('feature', 'sync', cloud);
            }.bind(this));

            // save
            this.save.save_as_fountain.add(this.track_handler('feature', 'save-fountain'));
            this.save.save_as_pdf.add(this.track_handler('feature', 'save-pdf'));
            this.save.dropbox_fountain.add(this.track_handler('feature', 'save-fountain-dropbox'));
            this.save.google_drive_fountain.add(this.track_handler('feature', 'save-fountain-googledrive'));
            this.save.dropbox_pdf.add(this.track_handler('feature', 'save-pdf-dropbox'));
            this.save.google_drive_pdf.add(this.track_handler('feature', 'save-pdf-googledrive'));

            // stats
            this.stats.goto.add(this.track_handler('feature', 'stats-scene-length-goto'));

        },

        track_event: function(category, action, label) {
            if (window.ga) {
                this.logger.info('Event sent', category, action, label || '');
                ga('send', 'event', category, action, label);
            } else {
                this.logger.debug('Event not sent:', category, action, label || '', ' [Google Analytics not loaded.]');
            }
        },

        track_handler: function(category, action, label) {
            return function() {
                this.track_event(category, action, label);
            }.bind(this);
        }

    });

    return Monitor.create();
});