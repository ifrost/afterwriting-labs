define(function(require) {

    var Protoplast = require('protoplast');

    /**
     * More complex step converted into functions
     * 
     * If WHEN, GIVEN or THEN section of acceptance test is longer than 4 lines it should be converted to a scenario function
     */
    var Scenarios = Protoplast.extend({
        
        env: null,
        
        $create: function(env) {
            this.env = env;
        },
        
        load_local_file: function(file, callback) {
            var env = this.env;
            
            env.browser.has_local_file(file);
            env.user.theme.open_plugin('open');

            env.user.open.open_local_file(file.name);
            env.browser.read_files(function() {
                env.browser.tick(3000);
                callback();
            });
        },
        
        load_dropbox_file: function(file, callback) {
            var env = this.env;
            
            env.dropbox.has_file(file);
            env.user.theme.open_plugin('open');

            env.user.open.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(3000);
            env.user.popup.select_file(file.name);
            env.user.popup.confirm_popup();

            env.browser.read_files(function() {
                env.browser.tick(3000);
                callback();
            });
        },

        /**
         * Create new script with a given text as content
         * @param {string} text
         */
        create_new_script: function(text) {
            var env = this.env;

            env.user.theme.open_plugin('open');
            env.user.open.create_new();
            env.user.theme.open_plugin('editor');
            env.user.editor.set_editor_content(text);
        }
        
    });

    return Scenarios;
});