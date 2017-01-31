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
                env.user.open_plugin('open');
                env.assert.event_tracked('navigation', 'open', 'main');
            });
            it('Switching plugins from the toolbar', function() {
                env.user.open_plugin('info');
                env.user.open_plugin('info');
                env.assert.event_not_tracked('navigation', 'info', 'toolbar');

                env.user.open_plugin_from_toolbar('open');
                env.assert.event_tracked('navigation', 'open', 'toolbar');
            });
            it('Switching between plugins using internal links', function() {
                env.user.open_plugin('info');

                env.user.click_switch_link('open');

                env.assert.event_tracked('navigation', 'open', 'switcher');
            });
            it('Closing content from the toolbar', function() {
                env.user.open_plugin('open');
                env.user.close_content();
                env.assert.event_tracked('navigation', 'toolbar-close', 'open');
            });
            it('Closing content by clicking on the background', function() {
                env.user.open_plugin('open');
                env.user.back_to_main();
                env.assert.event_tracked('navigation', 'back-close', 'open');
            });
            it('Expanding section info (question mark icon)', function() {
                env.user.open_plugin('open');
                env.user.click_info_icon('open-start');
                env.assert.event_tracked('feature', 'help', 'open-start');
            });
            it('Stretching section container to span the whole window', function() {
                env.user.open_plugin('open');
                env.user.click_expand_icon();
                env.assert.event_tracked('feature', 'expand');

                env.user.click_expand_icon();
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
            
            beforeEach(function() {
                env.user.open_plugin('open');
            });
            
            it('Opening a sample', function() {
                env.user.open_sample('brick_and_steel');
                env.assert.event_tracked('feature', 'open-sample', 'brick_and_steel');
            });
            it('Creating a new script', function() {
                env.user.create_new();
                env.assert.event_tracked('feature', 'open-new');
            });
            it('Opening a file dialog', function() {
                env.user.open_file_dialog();
                env.assert.event_tracked('feature', 'open-file-dialog');
            });
            it.skip('Opening a local file', function() {
                env.assert.event_tracked('feature', 'open-file-opened', 'format');
            });
            // DEBT: code duplication with open.js
            it('Opening a file from Dropbox', function(done) {
                env.dropbox.has_file({
                    name: 'file.fountain',
                    content: 'test content'
                });

                env.user.open_from_dropbox();
                env.dropbox.auth_dropbox();
                env.browser.tick(3000);
                env.user.select_file('file.fountain');
                env.user.confirm_popup();

                env.browser.read_files(function() {
                    env.browser.tick(3000);

                    env.assert.event_tracked('feature', 'open-dropbox', 'fountain');
                    done();
                });
            });
            it.skip('Opening a file from GoogleDrive', function() {
                env.user.open_from_googledrive();
                env.assert.event_tracked('feature', 'open-googledrive', 'format');
            });
            it.skip('Opening last used (on startup)', function() {
                env.assert.event_tracked('feature', 'open-last-used', 'startup');
            });
            it('Opening last used (link)', function() {
                env.user.open_last_used();
                env.assert.event_tracked('feature', 'open-last-used', 'manual');
            });
        });

        // DEBT: convert skipped test into integration tests
        describe.skip('Editor', function() {
            it('Synchronising the content', function() {
                env.assert.event_tracked('feature', 'sync', 'cloud');
            });
        });

        describe('Save', function() {

            beforeEach(function() {
                env.user.open_plugin('open');
                env.user.open_sample('brick_and_steel');
            });

            it('Saving as a fountain to local drive', function() {
                env.user.save_fountain_locally();
                env.user.close_popup();
                env.assert.event_tracked('feature', 'save-fountain');
            });
            it('Saving as a pdf to local drive', function() {
                env.user.save_pdf_locally();
                env.user.close_popup();
                env.assert.event_tracked('feature', 'save-pdf');
            });
            it('Saving as a fountain to Dropbox', function() {
                env.user.save_fountain_dropbox();
                env.assert.event_tracked('feature', 'save-fountain-dropbox');
            });
            it('Saving as a pdf to Dropbox', function() {
                env.user.save_pdf_dropbox();
                env.assert.event_tracked('feature', 'save-pdf-dropbox');
            });
            it.skip('Saving as a fountain to GoogleDrive', function() {
                env.user.save_fountain_google_drive();
                env.assert.event_tracked('feature', 'save-fountain-googledrive');
            });
            it.skip('Saving as a pdf to GoogleDrive', function() {
                env.user.save_pdf_google_drive();
                env.assert.event_tracked('feature', 'save-pdf-googledrive');
            });
        });

        describe('Preview', function() {
            it('Switching to save section', function() {
                env.assert.event_tracked('navigation', 'save', 'switcher');
            });
        });

        describe('Stats', function() {
            it('Switching to editor from scene length', function() {
                env.assert.event_tracked('feature', 'stats-scene-length-goto');
            });
        });
    });

});