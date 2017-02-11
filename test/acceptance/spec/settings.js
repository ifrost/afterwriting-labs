define(function(require) {

    var Env = require('acceptance/env');

    describe('Settings', function() {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('WHEN night mode checkbox is selected THEN night mode switches immediately,' +
            'AND WHEN night mode checkbos is deselected THEN night mode switches immediately', function() {
            // GIVEN
            env.user.create_new_script('test');
            env.user.open_plugin('settings');

            // WHEN
            env.user.select_night_mode();

            // THEN
            env.assert.night_mode_is_enabled(true);
            
            // AND WHEN
            env.user.select_night_mode();
            
            // THEN
            env.assert.night_mode_is_enabled(false);
        });
        
        it('GIVEN no custom settings are set WHEN settings plugin is selected THEN default values are selected', function() {
            
        });

    });

});