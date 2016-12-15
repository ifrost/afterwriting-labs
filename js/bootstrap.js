define(['dependencies', 'logger', 'utils/common', 'utils/decorator', 'd3', 'jquery', 'p', 'view/app-view', 'aw-bubble/model/theme-model', 'aw-bubble/controller/theme-controller', 'controller/app-controller', 'plugin/info/info-plugin', 'plugin/preview/preview-plugin'], function(_, logger, common, decorator, d3, $, Protoplast, AppView, ThemeModel, ThemeController, AppController, InfoPlugin, PreviewPlugin) {

    var log = logger.get('bootstrap'),
        module = {};

    var decorate_all_properties = function(plugin) {
        d3.keys(plugin).forEach(function(property) {
            if (typeof (plugin[property]) === "function" && !(plugin[property].decorated)) {
                plugin[property] = decorator(plugin[property]);
            }
        });
    };

    module.init = function(modules) {
        modules = Array.prototype.splice.call(modules, 0);

        log.info('Modules preparation.');
        modules.forEach(function(module) {
            if (module.prepare && typeof (module.prepare) === 'function') {
                module.prepare();
            }
        });

        var context = {
            plugins: []
        };

        var plugins = modules.filter(function(module) {
            return module && module.is_plugin;
        });

        module.plugins = [];
        plugins.forEach(function(plugin) {
            module.plugins[plugin.name] = plugin;
            decorate_all_properties(plugin);
        });

        log.info('Bootstrapping: ' + plugins.length + ' plugins found.');

        plugins.forEach(function(plugin) {
            log.info('Initializing plugin: ' + plugin.name);
            plugin.init();
        });

        var di = Protoplast.Context.create();

        var themeModel, themeController;
        di.register(themeModel = ThemeModel.create());
        di.register(themeController = ThemeController.create());
        di.register(AppController.create());
        di.register(InfoPlugin.create(di));
        di.register(PreviewPlugin.create(di));
        di.build();
        var root = Protoplast.Component.Root(document.body, di);




        plugins.forEach(function(plugin) {
            plugin.view = plugin.template ? plugin.template(plugin.context) : '';
            // DEBT: inject themeController, themeModel (+)
            // theme is not a module, it's created artificially here;
            // plugin should inject themeController, themeModel directly
            plugin.theme = {themeModel: themeModel, themeController: themeController};
            context.plugins.push(plugin);
            themeController.addSection(plugin.section);
        });

        root.add(AppView.create());

        log.info('Initializing layout');
        $('#loader').remove();

        log.info('Modules windup.');
        modules.forEach(function(module) {
            if (module.windup && typeof (module.windup) === 'function') {
                module.windup();
            }
        });

        log.info('Bootstrapping finished.');

        di._objects.pub('app/init');
    };


    return module;
});