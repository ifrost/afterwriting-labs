define(function (require) {

    var user = require('../helper/user'),
        env = require('../helper/env'),
        assert = require('../helper/assert');

    describe('App', function () {

        beforeEach(function() {
            env.setup();
        });

        afterEach(function() {
           env.restore();
        });

        it('Selected plugin is active', function() {
            user.open_plugin('info');
            assert.active_plugin_is('info');
            user.back_to_main();
        });

        it('Loads file list from dropbox', function() {
            env.clear_cookies();
            user.open_plugin('open');
            user.open_from_dropbox();
            env.auth_dropbox();
            assert.file_list_is_visible();
            user.close_popup();
            user.back_to_main();
        });

    });

});