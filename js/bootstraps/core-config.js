define(function(require) {

    var Plugin = require('core/plugin'),
        ThemeModel = require('aw-bubble/model/theme-model'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        AppController = require('core/controller/app-controller'),
        AppModel = require('core/model/app-model'),
        GoogleAnalyticsMonitor = require('core/controller/google-analytics-monitor'),
        PdfController = require('core/controller/pdf-controller'),
        Storage = require('core/model/storage'),
        Settings = require('core/model/settings'),
        ScriptModel = require('core/model/script-model');

    var CoreConfig = Plugin.extend({
        
        $create: function(context) {
            context.register(ThemeModel.create());
            context.register(ThemeController.create());
            context.register('monitor', GoogleAnalyticsMonitor.create());
            context.register('storage', Storage.create());
            context.register('settings', Settings.create());
            context.register('script', ScriptModel.create());
            context.register('pdf', PdfController.create());
            context.register(AppController.create());
            context.register('appModel', AppModel.create());
        }
        
    });

    return CoreConfig;
});