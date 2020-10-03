define(['../../test/acceptance/tests', 'protoplast'], function (_, Protoplast) {
    
    var AcceptanceTestsSetup = Protoplast.Object.extend({
        
        $create: function(Bootstrap, Config) {
            if (window.ACCEPTANCE) {
                // Dropbox-SDK keeps the reference to setTimeout so it cannot be stubbed
                // multiple times. Fake timers are also used to skip the initial animation.
                window.clock = sinon.useFakeTimers();
                window.testData = {
                    Bootstrap: Bootstrap,
                    Config: Config
                };
            }
        },
    
        run: function() {
            if (window.ACCEPTANCE) {
                window.clock.tick(5000);
                mocha.run(function() {
                    window.clock.restore();
                });
            }
        }
        
    });

    return AcceptanceTestsSetup;
});
