define(function (require) {

    var User = require('../helper/user'),
        Env = require('../helper/env'),
        Dom = require('../helper/dom'),
        Assert = require('../helper/assert');

    describe('App', function () {

        var env, user, dom, assert;

        beforeEach(function() {
            env = Env.create();
            env.setup();
            dom = Dom.create();
            user = User.create(env.browser, dom);
            assert = Assert.create(dom);
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