define(function(require) {

    var Protoplast = require('protoplast');

    var FakeGapiClient = Protoplast.extend({
        
        request: function() {
            
        }
        
    });

    return FakeGapiClient;
});