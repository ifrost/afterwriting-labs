define(function(require) {

    var Protoplast = require('protoplast');

    var ClientController = Protoplast.Object.extend({
        
        init: function() {
            console.log('initialised');
        }
        
    });

    return ClientController;
});