define(function (require) {

    var Env = require('acceptance/env');
    
    describe('Stats', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('GIVEN synchronisation is enabled WHEN stats plugin is selected AND content changes THEN stats are refreshed', function() {

        });
        
    });

});