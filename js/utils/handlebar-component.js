define(function(require) {

    var Handlebars = require('handlebars'),
        Protoplast = require('p');

    var HandlebarComponent = Protoplast.Component.extend({
        
        hbs: null,
        
        $create: function() {
            this.root.innerHTML = Handlebars.compile(this.hbs)();
            this.processRoot();
        },

        start: {
            sub: 'bubble-theme/init',
            value: function() {
                this.addInteractions();
            }
        }
        
    });

    return HandlebarComponent;
});