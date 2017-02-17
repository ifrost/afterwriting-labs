define(function(require) {

    var Protoplast = require('protoplast'),
        GoogleAnalyticsMonitor = require('core/controller/google-analytics-monitor'),
        PdfController = require('core/controller/pdf-controller'),
        Storage = require('core/model/storage'),
        Settings = require('core/model/settings'),
        ScriptModel = require('core/model/script-model');

    var CoreConfig = Protoplast.extend({
        
        init: function(context) {
            context.register('monitor', GoogleAnalyticsMonitor.create());
            context.register('storage', Storage.create());
            context.register('settings', Settings.create());
            context.register('script', ScriptModel.create());
            context.register('pdf', PdfController.create());
        }
        
    });

    return CoreConfig;
});