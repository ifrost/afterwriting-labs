define(function(require) {

    var p = require('p');

    /**
     * Helper for common browser tasks
     */
    var BrowserHelper = p.extend({

        setup: function() {
            this.clock = sinon.useFakeTimers();
            sinon.stub(window, 'open', function() {return {close: function() {}}});
            this.clock.tick(5000);
        },

        restore: function() {
            this.clock.restore();
            window.open.restore();
        },

        clear_cookies: function() {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        },

        tick: function(ms) {
            this.clock.tick(ms || 25);
        }

    });

    return BrowserHelper;

});