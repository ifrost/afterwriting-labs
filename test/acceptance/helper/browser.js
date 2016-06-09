define(function(require) {

    var p = require('p'),
        SinonFileReader = require('acceptance/util/sinon-file-reader');

    /**
     * Helper for common browser tasks
     */
    var BrowserHelper = p.extend({

        setup: function() {
            SinonFileReader.setup();
            this.clock = sinon.useFakeTimers();
            sinon.stub(window, 'open', function() {return {close: function() {}}});
            
            this.clear_cookies();
            this.clock.tick(5000);
        },

        read_files: function(done) {
            SinonFileReader.wait(done);
        },

        restore: function() {
            this.clear_cookies();
            this.clock.restore();
            window.open.restore();
            SinonFileReader.restore();
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