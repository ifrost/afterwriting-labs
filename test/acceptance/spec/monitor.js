define(function (require) {

    var Env = require('acceptance/helper/env');

    describe('Application Monitor', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('Tracks clicking on download button', function() {
            env.user.open_plugin('info');
            env.user.download_offline_app();
            env.assert.event_tracked('feature', 'download');
        });

    });

});