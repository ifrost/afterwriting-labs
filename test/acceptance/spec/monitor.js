define(function(require) {

    var Env = require('acceptance/helper/env');

    describe('Application Monitor', function() {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        describe('Navigation', function() {
            it('Switching plugins from the main menu', function() {
                env.assert.event_tracked('navigation', 'info', 'menu');
            });
            it('Switching plugins from the toolbar', function() {
                env.assert.event_tracked('navigation', 'info', 'toolbar');
            });
            it('Switching between plugins using internal links', function() {
                env.assert.event_tracked('navigation', 'info', 'switcher');
            });
            it('Closing content from the toolbar', function() {
                env.assert.event_tracked('navigation', 'toolbar-close', 'info');
            });
            it('Closing content by clicking on the background', function() {
                env.assert.event_tracked('navigation', 'back-close', 'info');
            });
            it('Expanding section info (question mark icon)', function() {
                env.assert.event_tracked('feature', 'help', 'sectionName');
            });
        });

        describe('Info', function() {
            it('Clicking on download button', function() {
                env.user.open_plugin('info');
                env.user.download_offline_app();
                env.assert.event_tracked('feature', 'download');
            });
        });

        describe('Open', function() {
            it('Opening a sample', function() {
                env.assert.event_tracked('feature', 'open-sample', 'sampleName');
            });
            it('Creating a new script', function() {
                env.assert.event_tracked('feature', 'open-new');
            });
            it('Opening a file dialog', function() {
                env.assert.event_tracked('feature', 'open-file-dialog');
            });
            it('Opening a local file', function() {
                env.assert.event_tracked('feature', 'open-file-opened', 'format');
            });
            it('Opening a file from Dropbox', function() {
                env.assert.event_tracked('feature', 'open-dropbox', 'format');
            });
            it('Opening a file from GoogleDrive', function() {
                env.assert.event_tracked('feature', 'open-googledriv', 'format');
            });
            it('Opening last used (on startup)', function() {
                env.assert.event_tracked('feature', 'open-last-used', 'startup');
            });
            it('Opening last used (link)', function() {
                env.assert.event_tracked('feature', 'open-last-used', 'manual');
            });
        });

        describe('Editor', function() {
            it('Synchronising the content', function() {
                env.assert.event_tracked('feature', 'sync', 'cloud');
            });
        });

        describe('Save', function() {
            it('Saving as a fountain to local drive', function() {
                env.assert.event_tracked('feature', 'save-fountain');
            });
            it('Saving as a pdf to local drive', function() {
                env.assert.event_tracked('feature', 'save-pdf');
            });
            it('Saving as a fountain to Dropbox', function() {
                env.assert.event_tracked('feature', 'save-fountain-dropbox');
            });
            it('Saving as a pdf to Dropbox', function() {
                env.assert.event_tracked('feature', 'save-pdf-dropbox');
            });
            it('Saving as a fountain to GoogleDrive', function() {
                env.assert.event_tracked('feature', 'save-fountain-googledrive');
            });
            it('Saving as a pdf to Dropbox', function() {
                env.assert.event_tracked('feature', 'save-pdf-googledrive');
            });
        });

        describe('Stats', function() {
            it('Switching to editor from scene length', function() {
                env.assert.event_tracked('feature', 'stats-scene-length-goto');
            });
        });
    });

});