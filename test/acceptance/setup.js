define(['../../test/acceptance/tests'], function () {

    var module = {};

    var enabled = window.location.search.indexOf('ACCEPTANCE') !== -1 || navigator.userAgent.indexOf('PhantomJS') !== -1;

    module.prepare = function () {
        if (enabled) {
            window.clock = sinon.useFakeTimers();
        }
    };

    module.windup = function () {
        if (enabled) {
            window.clock.tick(5000);
            mocha.run();
        }
    };

    return module;

});
