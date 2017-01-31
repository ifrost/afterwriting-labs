define(function(require) {

    var CoreConfig = require('bootstraps/core-config'),
        ThemeModel = require('aw-bubble/model/theme-model'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        AppController = require('core/controller/app-controller'),
        AppModel = require('core/model/app-model'),
        InfoPlugin = require('plugin/info/info-plugin'),
        IoPlugin = require('plugin/io/io-plugin'),
        EditorPlugin = require('plugin/editor/editor-plugin'),
        StatsPlugin = require('plugin/stats/stats-plugin'),
        SettingsPlugin = require('plugin/settings/settings-plugin'),
        PreviewPlugin = require('plugin/preview/preview-plugin'),
        MonitorPlugin = require('plugin/monitor/monitor-plugin'),
        AppView = require('view/app-view');

    var AppConfig = CoreConfig.extend({

        MainView: {
            value: AppView
        },
        
        init: function(context) {
            
            CoreConfig.init.call(this, context);

            context.register(ThemeModel.create());
            context.register(ThemeController.create());
            context.register(AppController.create());
            context.register('appModel', AppModel.create());

            context.register(InfoPlugin.create(context));
            context.register(IoPlugin.create(context));
            context.register(EditorPlugin.create(context));
            context.register(StatsPlugin.create(context));
            context.register(SettingsPlugin.create(context));
            context.register(PreviewPlugin.create(context));
            context.register(MonitorPlugin.create(context));
        }
        
    });

    return AppConfig;
});