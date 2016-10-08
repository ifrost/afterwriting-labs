define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast');

    var Logo = Protoplast.Component.extend({
        
        html: '<p class="logo">' + 
        '<span class="apostrophe">&rsquo;</span><span class="after">after</span><span class="writing">writing</span>' +
        '</p>'
        
    });

    return Logo;
});