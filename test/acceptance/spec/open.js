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
            env.browser.has_local_file({
                name: 'test.fountain',
                content: 'test'
            });
            env.user.open_plugin('open');
           
            // WHEN
            env.user.open_local_file('test.fountain');
            env.browser.read_files(function() {
                env.user.open_plugin('editor');
                env.browser.tick(3000);

                // THEN
                env.assert.editor_content('test');
                done();
            });
        });

        it('WHEN a FinalDraft file is loaded THEN editor is set to its converted content', function(done) {
            // WHEN
            env.browser.has_local_file({
                name: 'test.fountain',
                content: '<?xml version="1.0" encoding="UTF-8"?><FinalDraft DocumentType="Script" Template="No" Version="1"><Content><Paragraph Type="Action"><Text>Action. Action.</Text></Paragraph></Content></FinalDraft>'
            });
            env.user.open_plugin('open');

            // WHEN
            env.user.open_local_file('test.fountain');
            env.browser.read_files(function() {
                env.user.open_plugin('editor');
                env.browser.tick(3000);

                // THEN
                env.assert.editor_content('\nAction. Action.\n');
                done();
            });
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
            this.timeout(10000);
            env.dropbox.has_file({
                name: 'file.fountain',
                content: 'test content'
            });
            env.user.open_plugin('open');
            
            // WHEN: open file list
            env.user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(3000);
            // WHEN: select a file
            env.user.select_file('file.fountain');
            env.user.confirm_popup();

            env.browser.read_files(function() {
                env.browser.tick(3000);

                // THEN: switch to editor
                env.user.open_plugin('editor');
                env.browser.tick(3000);

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
        
    });

});