require(['dependencies', 'bootstrap', 'bootstraps/dev-config', '../test/acceptance/setup'], function (_, Bootstrap, DevConfig, AcceptanceTestsSetup) {
    // DEBT: split acceptance and dev bootstrap
    if (window.ACCEPTANCE) {
        var setup = AcceptanceTestsSetup.create(Bootstrap, DevConfig);
        setup.run();
    }
    else {
        Bootstrap.init(DevConfig);
    }
});