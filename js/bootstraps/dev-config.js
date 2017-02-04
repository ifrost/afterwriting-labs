define(function(require) {

    var AppConfig = require('bootstraps/app-config'),
        DevController = require('core/controller/dev-controller');

    var DevConfig = AppConfig.extend({
        
        testsSetup: null,
        
        init: function(context) {
            AppConfig.init.call(this, context);
            context.register(DevController.create());
        }
        
    });

    return DevConfig;
});