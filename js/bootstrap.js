define(function(require) {

    var Protoplast = require('protoplast');
    
    var Bootstrap = Protoplast.extend({

        Config: null,
        
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
            this.Config = Config;
            this.context = Protoplast.Context.create();

            this.Config.init(this.context);
            this.context.register(this);
            this.context.build();
        },

        _onContextReady: {
            injectInit: true,
            value: function() {
                if (this.Config.MainView) {
                    var root = Protoplast.Component.Root(document.body, this.context);
                    root.add(this.Config.MainView.create());
                }

                this.pub('app/init');

                if (this.Config.afterHook) {
                    this.Config.afterHook();
                }
            }
        }
        
    });

    return Bootstrap;
});