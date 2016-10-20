define(['dependencies', 'logger', 'aw-bubble/bubble-theme', 'utils/common', 'utils/decorator', 'd3', 'jquery'], function(_, logger, BubbleTheme, common, decorator, d3, $) {

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

        var theme = BubbleTheme.create();

        var footer = common.data.footer;
        if (window.hasOwnProperty('ENVIRONMENT') && window.ENVIRONMENT == 'dev') {
            footer += '<br /><span class="version">development version</span>';
        }
        theme.themeController.setFooter(footer);

        plugins.forEach(function(plugin) {
            plugin.view = plugin.template ? plugin.template(plugin.context) : '';
            plugin.theme = theme;
            context.plugins.push(plugin);
            theme.themeController.addSection(plugin.section);
        });

        log.info('Initializing layout');
        $('#loader').remove();

        log.info('Modules windup.');
        modules.forEach(function(module) {
            if (module.windup && typeof (module.windup) === 'function') {
                module.windup();
            }
        });

        log.info('Bootstrapping finished.');

        theme.start();

    };

    return module;
});