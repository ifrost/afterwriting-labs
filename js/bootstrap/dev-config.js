define(function(require) {

    var AppConfig = require('bootstrap/app-config'),
        DevController = require('core/controller/dev-controller');

    /**
     * Development Config - extension of AppConfig with additional DevController.
     * 
     * @alias DevConfig
     */
    var DevConfig = AppConfig.extend({
        
        testsSetup: null,
        
        init: function(context) {
            AppConfig.init.call(this, context);
            context.register(DevController.create());
        }
        
    });

    return DevConfig;
});