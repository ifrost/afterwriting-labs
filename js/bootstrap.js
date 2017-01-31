define(function(require) {

    var _ = require('dependencies'),
        logger = require('logger'),
        common = require('utils/common'),
        d3 = require('d3'),
        Protoplast = require('p'),
        AppView = require('view/app-view'),
        ThemeModel = require('aw-bubble/model/theme-model'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        AppController = require('core/controller/app-controller'),
        AppModel = require('core/model/app-model'),
        GoogleAnalyticsMonitor = require('core/controller/google-analytics-monitor'),
        PdfController = require('core/controller/pdf-controller'),
        Storage = require('core/model/storage'),
        Settings = require('core/model/settings'),
        ScriptModel = require('core/model/script-model'),
        MonitorPlugin = require('plugin/monitor/monitor-plugin'),
        InfoPlugin = require('plugin/info/info-plugin'),
        IoPlugin = require('plugin/io/io-plugin'),
        EditorPlugin = require('plugin/editor/editor-plugin'),
        StatsPlugin = require('plugin/stats/stats-plugin'),
        SettingsPlugin = require('plugin/settings/settings-plugin'),
        PreviewPlugin = require('plugin/preview/preview-plugin'),
        AcceptanceTestsSetup = require('../test/acceptance/setup');

    var Bootstrap = Protoplast.extend({

        init: function() {
            try {
                this._bootstrap();
            }
            catch (e) {
                // workaround for missing stack traces in PhantomJS
                console.error('Bootstrap error: ', e.message, e.stack);
                throw e;
            }
        },
        
        _bootstrap: function() {

            var di = Protoplast.Context.create();

            var testsSetup = AcceptanceTestsSetup.create();
            di.register(testsSetup);
            di.register(ThemeModel.create());
            di.register(ThemeController.create());
            di.register('monitor', GoogleAnalyticsMonitor.create());
            di.register('storage', Storage.create());
            di.register('settings', Settings.create());
            di.register('script', ScriptModel.create());
            di.register('pdf', PdfController.create());
            di.register(AppController.create());
            di.register('appModel', AppModel.create());
            di.register(InfoPlugin.create(di));
            di.register(IoPlugin.create(di));
            di.register(EditorPlugin.create(di));
            di.register(StatsPlugin.create(di));
            di.register(SettingsPlugin.create(di));
            di.register(PreviewPlugin.create(di));
            di.register(MonitorPlugin.create(di));

            di.build();

            var root = Protoplast.Component.Root(document.body, di);
            root.add(AppView.create());

            di._objects.pub('app/init');

            testsSetup.run();
        }
        
    });

    return Bootstrap;
});