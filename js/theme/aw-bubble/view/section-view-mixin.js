define(function(require) {

    var Protoplast = require('protoplast');

    var SectionViewMixin = Protoplast.extend({
        
        section: null,

        active: false,
        
        activate: function() {
            this.active = true;
        },
        
        deactivate: function() {
            this.active = false;
        },

        show: function() {

        },

        hide: function() {
            
        }
        
    });

    return SectionViewMixin;
});