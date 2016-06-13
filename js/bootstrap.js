define(['dependencies', 'logger', 'off', 'd3', 'jquery'], function(_, logger, off, d3, $) {

    var log = logger.get('bootstrap'),
        module = {};

    module.init = function(modules) {
        this.modules = Array.prototype.splice.call(modules, 0);

        log.info('Modules preparation.');
        this.modules.forEach(function(module) {
            if (module.prepare && typeof (module.prepare) === 'function') {
                module.prepare();
            }
        });

        this.modules.forEach(function(plugin) {
            off.decorate(plugin);
        });

        log.info('Bootstrapping: ' + modules.length + ' modules found.');

        log.info('Initializing modules');
        $('#loader').remove();
        this.modules.forEach(function(module) {
            if (module.init && typeof (module.init) === 'function') {
                module.init();
            }
        });

        log.info('Modules windup.');
        this.modules.forEach(function(module) {
            if (module.windup && typeof (module.windup) === 'function') {
                module.windup();
            }
        });

        log.info('Bootstrapping finished.');
    };

    return module;
});