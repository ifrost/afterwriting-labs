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

        it('Loads file from local disk', function(done) {
            env.user.open_plugin('open');
            env.browser.has_local_file({
                name: 'test.fountain',
                content: 'test'
            });
            env.user.open_local_file('test.fountain');
            env.browser.read_files(function() {
                env.user.open_plugin('editor');
                env.browser.tick(3000);

                env.assert.editor_content('test');

                done();
            });
        });

        it('Converts FDX to Fountain', function(done) {
            env.user.open_plugin('open');
            env.browser.has_local_file({
                name: 'test.fountain',
                content: '<?xml version="1.0" encoding="UTF-8"?><FinalDraft DocumentType="Script" Template="No" Version="1"><Content><Paragraph Type="Action"><Text>Action. Action.</Text></Paragraph></Content></FinalDraft>'
            });
            env.user.open_local_file('test.fountain');
            env.browser.read_files(function() {
                env.user.open_plugin('editor');
                env.browser.tick(3000);

                env.assert.editor_content('\nAction. Action.\n');

                done();
            });
        });

        it('Loads file list from Dropbox', function() {
            env.user.open_plugin('open');
            env.user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(1000);
            env.assert.file_list_is_visible();
            env.user.close_popup();
        });
        
        it('Loads selected Dropbox file', function(done) {
            this.timeout(10000);
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

                env.assert.editor_content('test content');
                done();
            });
        });
    });
    
});