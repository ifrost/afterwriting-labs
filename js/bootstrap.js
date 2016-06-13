define(['dependencies', 'logger', 'off', 'd3', 'jquery', 'p'], function(_, logger, off, d3, $, p) {

    var log = logger.get('bootstrap'),
        module = {};

    module.init = function(modules) {
        this.modules = Array.prototype.splice.call(modules, 0);

        var context = p.Context.create();
        context.register('core', this);
        this.modules.forEach(function(module) {
            context.register(module.name, module);
        }, this);

        log.info('Modules preparation.');
        $('#loader').remove();

        this.modules.forEach(function(module) {
            if (module.prepare && typeof (module.prepare) === 'function') {
                module.prepare();
            }
        });

        this.modules.forEach(function(plugin) {
            off.decorate(plugin);
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