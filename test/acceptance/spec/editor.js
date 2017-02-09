define(function(require) {

    var Env = require('acceptance/helper/env');

    describe('Editor', function() {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('WHEN save fountain locally is clicked THEN save fountain dialog is displayed', function() {
            // GIVEN
            env.user.open_sample('brick_and_steel');
            env.user.open_plugin('editor');

            // WHEN
            env.user.save_fountain_locally('editor');

            // THEN
            env.assert.select_file_name_popup_is_visible();
        });

        it('WHEN save fountain to Dropbox button is clicked THEN save fountain to Dropbox dialog is displayed', function() {
            // GIVEN
            env.user.open_sample('brick_and_steel');
            env.user.open_plugin('editor');

            // WHEN
            env.user.save_fountain_dropbox('editor');
            env.dropbox.auth_dropbox();
            env.browser.tick(3000);

            // THEN
            env.assert.dropbox_popup_visible();
        });

        it.skip('WHEN save fountain to GoogleDrive button is clicked THEN save fountain to GoogleDrive dialog is displayed', function() {

        });

        it('WHEN a new content is created THEN auto-reload AND auto-save are not available', function() {
            // WHEN
            env.user.open_plugin('open');
            env.user.create_new();
            env.user.open_plugin('editor');

            // THEN
            env.assert.auto_reload_is_visible(false);
            // AND
            env.assert.auto_save_visible(false);
        });

        it('WHEN a sample script is opened THEN auto-reload AND auto-save are not available', function() {
            // WHEN
            env.user.open_plugin('open');
            env.user.open_sample('brick_and_steel');
            env.user.open_plugin('editor');

            // THEN
            env.assert.auto_reload_is_visible(false);
            // AND
            env.assert.auto_save_visible(false);
        });
        
        it('GIVEN GoogleDrive is available THEN save to GoogleDrive button is visible', function() {
            // GIVEN
            env.google_drive.disable();
            env.user.open_plugin('open');
            env.user.open_sample('brick_and_steel');
            env.user.open_plugin('editor');

            // THEN
            env.assert.save_to_google_drive_visible('editor', 'fountain', true);

            env.google_drive.enable();
        });

        it('GIVEN GoogleDrive is not available THEN save to GoogleDrive button is not visible', function() {
            // GIVEN
            env.google_drive.disable();
            env.user.open_plugin('open');
            env.user.open_sample('brick_and_steel');
            env.user.open_plugin('editor');

            // THEN
            env.assert.save_to_google_drive_visible('editor', 'fountain', false);

            env.google_drive.enable();
        });

        it('WHEN Dropbox is not available THEN save to Dropbox button is not visible', function() {
            // GIVEN
            env.dropbox.disable();
            env.user.open_plugin('open');
            env.user.open_sample('brick_and_steel');
            env.user.open_plugin('editor');

            // THEN
            env.assert.save_to_dropbox_visible('editor', 'fountain', false);

            env.dropbox.enable();
        });

        // DEBT: copy from open.js:18 (+)
        it('WHEN local file is loaded THEN auto-save is not available AND auto-reload is available', function(done) {
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
                env.assert.auto_reload_is_visible(true);
                // AND
                env.assert.auto_save_visible(false);

                done();
            });
        });

        describe('WHEN a file is loaded from Dropbox', function() {

            beforeEach(function(done) {

                env.dropbox.has_file({
                    name: 'file.fountain',
                    content: 'test content'
                });

                env.user.open_plugin('open');
                env.user.open_from_dropbox();
                env.dropbox.auth_dropbox();
                env.browser.tick(3000);
                env.user.select_file('file.fountain');
                env.user.confirm_popup();

                env.browser.read_files(function() {
                    env.browser.tick(3000);
                    env.user.open_plugin('editor');
                    env.browser.tick(3000);
                    done();
                });
            });

            it('THEN auto-reload and auto-save are available', function() {
               // THEN
                env.assert.auto_reload_is_visible(true);
                env.assert.auto_save_visible(true);
            });

            it('AND empty content is created THEN auto-reload and auto-save are not available', function() {
                // AND
                env.user.open_plugin('open');
                env.user.create_new();

                // THEN
                env.assert.auto_reload_is_visible(false);
                env.assert.auto_save_visible(false);
            });

            describe('AND auto-save is enabled', function() {

                beforeEach(function() {
                    // AND
                    env.assert.dropbox_saved(0);
                    env.user.turn_auto_save_on();
                });

                it('THEN current content is saved immediately', function(done) {
                    env.assert.dropbox_saved(1);
                    done();
                });

                it('AND multiple save cycle passes THEN current content is saved once', function(done) {
                    // AND
                    env.browser.tick(3000);
                    env.browser.tick(3000);
                    env.browser.tick(3000);
                    env.assert.dropbox_saved(1);

                    done();
                });

                it('AND content changes THEN new content is saved', function(done) {
                    // AND
                    env.user.set_editor_content('changed content');
                    env.browser.tick(5000);
                    
                    // THEN
                    env.assert.dropbox_saved(2);
                    done();
                });

                it('AND content changes AND content is set to the same value THEN content is not saved', function(done) {
                    // AND: content changes
                    env.user.set_editor_content('changed content');
                    env.browser.tick(5000);

                    // AND: content is set to the same value
                    env.user.set_editor_content('changed content');
                    env.browser.tick(5000);
                    
                    // THEN
                    env.assert.dropbox_saved(2);
                    done();
                });

            });

            describe('WHEN synchronisation is enabled AND content of sync file changes', function() {

                beforeEach(function(done) {
                    // WHEN Synchronisation is enabled
                    env.user.turn_sync_on();
                    
                    // AND content od sync file changes
                    env.dropbox.content_change('file.fountain', 'changed content');
                    env.browser.tick(10000);
                    env.browser.read_files(function() {
                        env.browser.tick(3000);
                        done();
                    });
                });

                it('THEN content of the editor is set to new file contet', function(done) {
                    // THEN
                    env.assert.editor_content('changed content');
                    done();
                });

                it('AND synchronisation is disabled AND file content changes THEN editor content is not updated with the latest update', function(done) {
                    // AND: synchronisation is disabed
                    env.user.turn_sync_off();
                    
                    // AND: file content changes
                    env.dropbox.content_change('file.fountain', 'override after sync');
                    env.browser.tick(10000);
                    
                    // THEN 
                    env.assert.editor_content('changed content');
                    env.user.sync_keep_content();
                    env.assert.editor_content('changed content');

                    done();
                });

                it('AND file content changes AND synchronisation is disabled AND previous content is reloaded THEN editor content is set to previous value', function(done) {
                    // AND: file content changes
                    env.dropbox.content_change('file.fountain', 'override after sync');
                    env.browser.tick(10000);

                    // AND: sync disabled
                    env.user.turn_sync_off();
                    
                    // AND: previous content is reloaded
                    env.user.sync_reload_content_before_sync();
                    
                    // THEN
                    env.assert.editor_content('test content');
                    done();
                });
            });

        });

    });

});