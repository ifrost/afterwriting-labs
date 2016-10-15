define(function (require) {

    var Env = require('acceptance/helper/env');

    describe('Application', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('Clicking on page stats switches to editor', function() {
            env.user.create_new_script('test');
            env.user.open_plugin('stats');
            env.user.click_on_page_stats();

            env.assert.active_plugin_is('editor');
        });

    });

});