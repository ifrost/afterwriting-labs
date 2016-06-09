define(['../../test/acceptance/tests'], function () {

    var module = {};
   
    module.prepare = function () {
        if (window.ACCEPTANCE) {
            // XXX: fake timer created to skip the animation at the beginning
            window.clock = sinon.useFakeTimers();
        }
    };

    module.windup = function () {
        if (window.ACCEPTANCE) {
            window.clock.tick(5000);
            window.clock.restore();
            mocha.run();
        }
    };

    return module;
});
