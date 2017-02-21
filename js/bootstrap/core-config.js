define(function(require) {

    var Protoplast = require('protoplast'),
        PdfController = require('core/controller/pdf-controller'),
        Settings = require('core/model/settings'),
        ScriptModel = require('core/model/script-model');

    /**
     * Core Config with all core controllers and utils.
     * 
     * @alias CoreConfig
     */
    var CoreConfig = Protoplast.extend({
        
        init: function(context) {
            context.register('settings', Settings.create());
            context.register('script', ScriptModel.create());
            context.register('pdf', PdfController.create());
        }
        
    });

    return CoreConfig;
});