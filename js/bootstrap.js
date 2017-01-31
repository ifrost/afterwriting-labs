define(function(require) {

    var _ = require('dependencies'),
        logger = require('logger'),
        Protoplast = require('p'),
        AppView = require('view/app-view');
    
    var Bootstrap = Protoplast.extend({

        config: null,
        
        context: null,

        pub: {
            inject: 'pub'
        },

        init: function(Config) {
            try {
                this._bootstrap(Config);
            }
            catch (e) {
                // workaround for missing stack traces in PhantomJS
                console.error('Bootstrap error: ', e.message, e.stack);
                throw e;
            }
        },
        
        _bootstrap: function(Config) {
            this.context = Protoplast.Context.create();
            this.config = Config.create(this.context);
            this.context.register(this);
            this.context.build();
        },

        _onContextReady: {
            injectInit: true,
            value: function() {
                var root = Protoplast.Component.Root(document.body, this.context);
                root.add(AppView.create());

                this.pub('app/init');

                if (this.config.afterHook) {
                    this.config.afterHook();
                }
            }
        }
        
    });

    return Bootstrap;
});