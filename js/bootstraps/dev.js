require(['dependencies', 'bootstrap', 'bootstraps/dev-config', '../test/acceptance/setup'], function (_, Bootstrap, DevConfig, AcceptanceTestsSetup) {
    window.Bootstrap = Bootstrap;
    window.DevConfig = DevConfig;
    var setup = AcceptanceTestsSetup.create();
    setup.run();
});