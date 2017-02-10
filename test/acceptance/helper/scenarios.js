define(function(require) {

    var Protoplast = require('protoplast');

    var Scenarios = Protoplast.extend({
        
        env: null,
        
        $create: function(env) {
            this.env = env;
        },
        
        load_local_file: function(file, callback) {
            var env = this.env;
            
            env.browser.has_local_file(file);
            env.user.open_plugin('open');

            env.user.open_local_file(file.name);
            env.browser.read_files(function() {
                env.browser.tick(3000);
                callback();
            });
        },
        
        load_dropbox_file: function(file, callback) {
            var env = this.env;
            
            env.dropbox.has_file(file);
            env.user.open_plugin('open');

            env.user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(3000);
            env.user.select_file(file.name);
            env.user.confirm_popup();

            env.browser.read_files(function() {
                env.browser.tick(3000);
                callback();
            });
        }
        
    });

    return Scenarios;
});