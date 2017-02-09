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

            it('WHEN open plugin is selected THEN navigation/open/main event is tracked', function() {
                // WHEN
                env.user.open_plugin('open');

                // THEN
                env.assert.event_tracked('navigation', 'open', 'main');
            });

            it('WHEN open plugin is selected from toolbar THEN navigation/info/toolbar event is tracked', function() {
                // GIVEN: make toolbar visible
                env.user.open_plugin('info');

                // WHEN
                env.user.open_plugin_from_toolbar('open');

                // THEN
                env.assert.event_tracked('navigation', 'open', 'toolbar');
            });

            it.skip('WHEN selected plugin is re-selected THEN event is tracked only once', function() {
            });

            it('GIVEN info plugin is displayed WHEN switch to open is clicked THEN navigation/open/switcher event is tracked', function() {
                // GIVEN
                env.user.open_plugin('info');

                // WHEN
                env.user.click_switch_link('open');

                // THEN
                env.assert.event_tracked('navigation', 'open', 'switcher');
            });

            it('GIVEN a plugin X is opened WHEN close button is clicked THEN navigation/toolbar-close/X is tracked', function() {
                // GIVEN
                env.user.open_plugin('open');

                // WHEN
                env.user.close_content();

                // THEN
                env.assert.event_tracked('navigation', 'toolbar-close', 'open');
            });

            it('GIVEN a plugin is opened WHEN background is clicked THEN content is hidden', function() {
                // GIVEN
                env.user.open_plugin('open');

                // WHEN
                env.user.back_to_main();

                // THEN
                env.assert.event_tracked('navigation', 'back-close', 'open');
            });

            it('WHEN a section X is expanded (question mark icon) THEN feature/help/X event is tracked', function() {
                // GIVEN
                env.user.open_plugin('open');

                // WHEN
                env.user.click_info_icon('open-start');

                // THEN
                env.assert.event_tracked('feature', 'help', 'open-start');
            });

            it('WHEN expand button is clicked then feature/expand event is tracked', function() {
                // GIVEN
                env.user.open_plugin('open');

                // WHEN
                env.user.click_expand_icon();

                // THEN
                env.assert.event_tracked('feature', 'expand');
            });
        });

        describe('Info', function() {
            it('WHEN download button is clicked THEN feature/download is tracked', function() {
                // GIVEN
                env.user.open_plugin('info');

                // WHEN
                env.user.download_offline_app();

                // THEN
                env.assert.event_tracked('feature', 'download');
            });
        });

        describe('Open', function() {

            beforeEach(function() {
                env.user.open_plugin('open');
            });

            it('WHEN a sample with title title is selected THEN feature/open-sample/title event is tracked', function() {
                // WHEN
                env.user.open_sample('brick_and_steel');

                // THEN
                env.assert.event_tracked('feature', 'open-sample', 'brick_and_steel');
            });

            it('WHEN an empty script is created THEN feature/open-new event is tracked', function() {
                // WHEN
                env.user.create_new();

                // THEN
                env.assert.event_tracked('feature', 'open-new');
            });

            it('WHEN open from local disk dialog is opened THEN feature/open-file-dialog event is traced', function() {
                // WHEN
                env.user.open_file_dialog();

                // THEN
                env.assert.event_tracked('feature', 'open-file-dialog');
            });

            // TODO: take steps from open.js
            it.skip('WHEN a local file is loaded THEN feature/open-file-opened event is tracked AND format is passed', function() {
                env.assert.event_tracked('feature', 'open-file-opened', 'format');
            });

            // DEBT: code duplication with open.js
            it('WHEN a file is opened from Dropbox THEN feature/open-dropbox event is tracked AND format is passed', function(done) {
                // GIVEN
                env.dropbox.has_file({
                    name: 'file.fountain',
                    content: 'test content'
                });
                env.user.open_plugin('open');

                // WHEN
                env.user.open_from_dropbox();
                env.dropbox.auth_dropbox();
                env.browser.tick(3000);
                env.user.select_file('file.fountain');
                env.user.confirm_popup();

                env.browser.read_files(function() {
                    env.browser.tick(3000);

                    // THEN
                    env.assert.event_tracked('feature', 'open-dropbox', 'fountain');
                    done();
                });
            });

            // TODO: test asserting editor's content
            it('WHEN open last used in selected THEN feature/open-last-used/manual event is traced', function() {
                // WHEN
                env.user.open_last_used();

                // THEN
                env.assert.event_tracked('feature', 'open-last-used', 'manual');
            });
        });

        // DEBT: convert skipped test into integration tests
        describe.skip('Editor', function() {
            it('WHEN content is synchronised THEN feature/sync/cloud event is tracked', function() {
                // THEN
                env.assert.event_tracked('feature', 'sync', 'cloud');
            });
        });

        describe('Save', function() {

            beforeEach(function() {
                env.user.open_plugin('open');
                env.user.open_sample('brick_and_steel');
            });

            it('WHEN a fountain file is saved to local disk THEN feature/save-fountain event is tracked', function() {
                // WHEN
                env.user.save_fountain_locally('save');

                // THEN
                env.assert.event_tracked('feature', 'save-fountain');
            });

            it('WHEN a pdf file is saved to local disk THEN feature/save-pdf event is tracked', function() {
                // WHEN
                env.user.save_pdf_locally('save');

                // THEN
                env.assert.event_tracked('feature', 'save-pdf');
            });

            it('WHEN a fountain file is saved to Dropbox THEN feature/save-fountain-dropbox event is tracked', function() {
                // WHEN
                env.user.save_fountain_dropbox('save');

                // THEN
                env.assert.event_tracked('feature', 'save-fountain-dropbox');
            });

            it('WHEN a pdf file is saved to Dropbox THEN feature/save-pdf-dropbox event is tracked', function() {
                // WHEN
                env.user.save_pdf_dropbox('save');

                // THEN
                env.assert.event_tracked('feature', 'save-pdf-dropbox');
            });

            it.skip('WHEN a fountain file is saved to GoogleDrive THEN feature/save-fountain-googledrive event is tracked', function() {
                env.user.save_fountain_google_drive('save');
                env.assert.event_tracked('feature', 'save-fountain-googledrive');
            });

            it.skip('WHEN a pdf file is saved to GoogleDrive THEN feature/save-pdf-googledrive event is tracked', function() {
                env.user.save_pdf_google_drive('save');
                env.assert.event_tracked('feature', 'save-pdf-googledrive');
            });
        });

        describe('Stats', function() {
            it('WHEN scene length graph bar is clicked THEN editor is displayed AND eature/stats-scene-length-goto event is dispatched', function() {
                // GIVEN
                env.user.open_plugin('open');
                env.user.open_sample('brick_and_steel');
                env.user.open_plugin('stats');

                // WHEN
                env.user.click_on_page_stats();

                // THEN
                env.assert.active_plugin_is('editor');
                env.assert.event_tracked('feature', 'stats-scene-length-goto');
            });
        });
    });

});