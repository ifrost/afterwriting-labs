define(function(require) {

    var p = require('p');

    var BrowserHelper = p.extend({

        setup: function() {
            window.clock = sinon.useFakeTimers();
            sinon.stub(window, 'open', function() {return {close: function() {}}});
            window.clock.tick(5000);
        },

        restore: function() {
            window.clock.restore();
            window.open.restore();
        },

        clear_cookies: function() {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        },

        tick: function(ms) {
            window.clock.tick(ms || 25);
        }

    });

    return BrowserHelper;

});