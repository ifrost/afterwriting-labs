define(function(require) {

    var Protoplast = require('p');

    var TooltipModel = Protoplast.Model.extend({
        
        text: null,
        
        x: 0,
        
        y: 0
        
    });

    return TooltipModel;
});