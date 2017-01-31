define(function(require) {

    var CoreConfig = require('bootstraps/core-config'),
        PdfController = require('core/controller/pdf-controller'),
        Settings = require('core/model/settings'),
        ScriptModel = require('core/model/script-model'),
        ClientController = require('client/client-controller');
    
    var ClientConfig = CoreConfig.extend({
        
        init: function(context) {
            context.register('settings', Settings.create());
            context.register('script', ScriptModel.create());
            context.register('pdf', PdfController.create());
            context.register(ClientController.create());
        }
        
    });

    return ClientConfig;
});