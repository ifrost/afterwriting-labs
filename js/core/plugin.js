define(function(require) {

    var Protoplast = require('p');

    var Plugin = Protoplast.Object.extend({
        
        context: null,
        
        $create: function(context) {
            this.context = context;
        }
        
    });

    return Plugin;
});