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
        
        it('Loads file list from dropbox', function() {
            env.user.open_plugin('open');
            env.user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(1000);
            env.assert.file_list_is_visible();
            env.user.close_popup();
        });
        
        it('loads selected file', function() {
            env.dropbox.has_file({
                name: 'file.fountain',
                content: 'test content'
            });
            
            env.user.open_plugin('open');
            env.user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(1000);
            env.user.selects_file('file.fountain');
            env.user.confirm_popup();
            
            env.user.open_plugin('editor');
            env.assert.editor_content('test content');
        });
    });
    
});