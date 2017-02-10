define(function(require) {

    var Env = require('acceptance/helper/env');

    describe('Open', function() {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('WHEN a file is loaded from disk THEN editor value is set to its content', function(done) {
            // GIVEN
            env.scenarios.load_local_file(
                {
                    name: 'test.fountain',
                    content: 'test'
                },
                function() {
                    env.user.open_plugin('editor');

                    // THEN
                    env.assert.editor_content('test');

                    done();
                }
            );
        });

        it('WHEN a FinalDraft file is loaded THEN editor is set to its converted content', function(done) {
            // WHEN
            env.scenarios.load_local_file({
                    name: 'test.fountain',
                    content: '<?xml version="1.0" encoding="UTF-8"?><FinalDraft DocumentType="Script" Template="No" Version="1"><Content><Paragraph Type="Action"><Text>Action. Action.</Text></Paragraph></Content></FinalDraft>'
                },
                function() {
                    env.user.open_plugin('editor');

                    // THEN
                    env.assert.editor_content('\nAction. Action.\n');
                    done();
                }
            );
        });

        it('WHEN open from Dropbox is clicked THEN list of files is displayed', function() {
            // GIVE
            env.user.open_plugin('open');

            // WHEN
            env.user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(1000);

            // THEN
            env.assert.file_list_is_visible();
        });

        it('WHEN a Dropbox file is loaded THEN editor is set to its content', function(done) {
            // GIVEN
            env.scenarios.load_dropbox_file({
                name: 'file.fountain',
                content: 'test content'
            }, function() {
                // THEN: switch to editor
                env.user.open_plugin('editor');
            
                // THEN
                env.assert.editor_content('test content');
                done();
            });
        });

        it.skip('WHEN open dialog is displayed THEN search bar is visible', function() {

        });

        it.skip('WHEN open dialog is displayed AND at least 3 letters are typed to search THEN list is filtered', function() {

        });

        it('GIVEN GoogleDrive is available WHEN open plugin is opened THEN open from GoogleDrive link is visible', function() {
            // GIVEN
            env.user.open_plugin('open');

            // THEN
            env.assert.open_from_google_drive_visible(true);
        });

        it('GIVEN GoogleDrive is not available WHEN open plugin is opened THEN open from GoogleDrive link is not visible', function() {
            // GIVEN
            env.google_drive.disable();
            env.user.open_plugin('open');

            // THEN
            env.assert.open_from_google_drive_visible(false);

            env.google_drive.enable();
        });

        it('GIVEN fresh app WHEN open plugin is opened THEN last used content link is not displayed', function() {
            // GIVEN
            env.user.open_plugin('open');

            // THEN
            env.assert.last_used_is_visible(false);
        });

        it('GIVEN content is set WHEN app is reloaded THEN last used content link is displayed', function() {
            // GIVEN
            env.user.create_new_script('Title: Test Script');

            // WHEN
            env.refresh();

            // THEN
            env.user.open_plugin('open');
            env.assert.last_used_is_visible(true);
            env.assert.last_used_title('Test Script');
        });

        it('GIVEN last content link is visible WHEN last opened is clicked THEN editor contains last used content', function() {
            // GIVEN
            env.user.create_new_script('Title: Test Script');
            env.refresh();

            // WHEN
            env.user.open_plugin('open');
            env.user.open_last_used();
            env.user.open_plugin('editor');

            // THEN
            env.assert.editor_content('Title: Test Script');
        });

    });

});