define(function (require) {

    var user = require('../helper/user'),
        assert = require('../helper/assert');

    describe('App', function () {

        it('Selected plugin is active', function() {
            user.open_plugin('info');

            assert.active_plugin_is('info');
            
            user.back_to_main();
        });

    });

});