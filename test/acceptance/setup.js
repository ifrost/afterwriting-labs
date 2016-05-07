define(['../../test/acceptance/tests'], function () {

    var module = {};

    var enabled = window.location.search.indexOf('ACCEPTANCE') !== -1 || navigator.userAgent.indexOf('PhantomJS') !== -1;

    module.prepare = function () {
        if (enabled) {
            // XXX: fake timer created to skip the animation at the beginning
            window.clock = sinon.useFakeTimers();
        }
    };

    module.windup = function () {
        var enabled = window.location.search.indexOf('ACCEPTANCE') !== -1 || navigator.userAgent.indexOf('PhantomJS') !== -1;
        if (enabled) {
            window.clock.tick(5000);
            window.clock.restore();
            mocha.run();
        }
    };

    return module;
});
