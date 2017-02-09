define(function(require) {

    var Handlebars = require('handlebars'),
        Protoplast = require('protoplast');

    /**
     * @deprecated Use BaseComponent
     */
    var HandlebarComponent = Protoplast.Component.extend({
        
        hbs: null,
        
        $create: function() {
            this.root.innerHTML = Handlebars.compile(this.hbs)();
            this.processRoot();
        },

        // DEBT: HandleBar Component should not know about bubble theme (+)
        start: {
            sub: 'bubble-theme/init',
            value: function() {
                this.addInteractions();
            }
        },

        addInteractions: function() {}
        
    });

    return HandlebarComponent;
});