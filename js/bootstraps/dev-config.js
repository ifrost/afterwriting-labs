define(function(require) {

    var Plugin = require('core/plugin'),
        AppConfig = require('bootstraps/app-config'),
        AcceptanceTestsSetup = require('../../test/acceptance/setup');

    var DevConfig = Plugin.extend({
        
        testsSetup: null,
        
        $create: function(context) {
            this.testsSetup = AcceptanceTestsSetup.create();
            context.register(this.testsSetup);
            AppConfig.create(context);
        },
        
        afterHook: function() {
            this.testsSetup.run();
        }
        
    });

    return DevConfig;
});