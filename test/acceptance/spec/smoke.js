define(function(require) {

    var Env = require('acceptance/helper/env');

    describe('Smoke test', function() {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('Selected plugin is active', function() {
            env.user.open_plugin('info');
            env.assert.active_plugin_is('info');
        });

    });

});