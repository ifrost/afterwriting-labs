define(function (require) {

    var user = require('../helper/user'),
        Env = require('../helper/env'),
        assert = require('../helper/assert');

    describe('App', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
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
            env.browser.clear_cookies();
            user.open_plugin('open');
            user.open_from_dropbox();
            env.dropbox.auth_dropbox();
            env.browser.tick(1000);
            assert.file_list_is_visible();
            user.close_popup();
            user.back_to_main();
        });

    });

});