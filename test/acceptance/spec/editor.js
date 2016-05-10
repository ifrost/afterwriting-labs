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

        describe('After loading from Dropbox', function() {

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

            describe('Synchronization', function() {

                beforeEach(function(done) {
                    env.user.turn_sync_on();
                    env.dropbox.content_change('file.fountain', 'changed content');
                    env.browser.tick(10000);
                    env.browser.read_files(function() {
                        env.browser.tick(3000);
                        done();
                    });
                });

                it('Loads the content', function(done) {
                    env.assert.editor_content('changed content');
                    done();
                });

                it('Does not update the content after turning the sync off', function(done) {
                    env.user.turn_sync_off();
                    env.dropbox.content_change('file.fountain', 'override after sync');
                    env.browser.tick(10000);
                    env.assert.editor_content('changed content');
                    done();
                });

                it('Keeps the content after turning off', function(done) {
                    env.user.turn_sync_off();
                    env.user.sync_keep_content();
                    env.assert.editor_content('changed content');

                    env.dropbox.content_change('file.fountain', 'override after sync');
                    env.browser.tick(10000);
                    env.assert.editor_content('changed content');
                    done();
                });

                it('Reloads previous content after turning off', function(done) {
                    env.user.turn_sync_off();
                    env.user.sync_reload_content_before_sync();
                    env.assert.editor_content('test content');
                    done();
                });
            });

        });

    });

});