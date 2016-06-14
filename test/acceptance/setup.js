define(['core/module', '../../test/acceptance/tests'], function(Module) {

    var module = Module.create('acceptance_test_setup');

    if (window.ACCEPTANCE) {
        // XXX: fake timer created to skip the animation at the beginning
        window.clock = sinon.useFakeTimers();
    }

    module.windup = function() {
        if (window.ACCEPTANCE) {
            window.clock.tick(5000);
            window.clock.restore();
            mocha.run();
        }
    };

    return module;
});
