define(function (require) {

    var Env = require('acceptance/helper/env');
    
    describe('Facts', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });
        
        it('GIVEN synchronisation is enabled WHEN facts plugin is selected AND content changes THEN facts are refreshed', function() {
            
        });
        
    });

});