define(function(require) {

    var AppConfig = require('bootstraps/app-config'),
        DevController = require('core/controller/dev-controller'),
        AcceptanceTestsSetup = require('../../test/acceptance/setup');

    var DevConfig = AppConfig.extend({
        
        testsSetup: null,
        
        init: function(context) {
            this.testsSetup = AcceptanceTestsSetup.create();
            context.register(this.testsSetup);
            AppConfig.init.call(this, context);
            context.register(DevController.create());
        },
        
        afterHook: function() {
            this.testsSetup.run();
        }
        
    });

    return DevConfig;
});