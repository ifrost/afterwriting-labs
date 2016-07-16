define(['dependencies', 'protoplast'], function(_, p) {

    var Bootstrap = p.extend({
        
        init: function(modules) {

            this.modules = Array.prototype.splice.call(modules, 0);

            var context = p.Context.create();

            context.register('core', this);

            this.modules.forEach(function(module) {
                context.register(module.name, module);
            }, this);

            context.build();

            this.modules.forEach(function(module) {
                if (module.windup && typeof (module.windup) === 'function') {
                    module.windup();
                }
            });
        }
    });

    return Bootstrap.create();
});