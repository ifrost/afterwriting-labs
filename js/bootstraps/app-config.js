define(function(require) {

    var Plugin = require('core/plugin'),
        CoreConfig = require('bootstraps/core-config'),
        InfoPlugin = require('plugin/info/info-plugin'),
        IoPlugin = require('plugin/io/io-plugin'),
        EditorPlugin = require('plugin/editor/editor-plugin'),
        StatsPlugin = require('plugin/stats/stats-plugin'),
        SettingsPlugin = require('plugin/settings/settings-plugin'),
        PreviewPlugin = require('plugin/preview/preview-plugin'),
        MonitorPlugin = require('plugin/monitor/monitor-plugin');

    var AppConfig = Plugin.extend({
        
        $create: function(context) {
            CoreConfig.create(context);
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