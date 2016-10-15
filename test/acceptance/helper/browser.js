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
            this.clear_local_storage();
            this.clock.tick(5000);
        },

        read_files: function(done) {
            SinonFileReader.wait(done);
        },

        restore: function() {
            this.clear_cookies();
            this.clear_local_storage();
            this.clock.restore();
            window.open.restore();
            SinonFileReader.restore();
        },

        clear_cookies: function() {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        },

        clear_local_storage: function() {
            window.localStorage.clear();
        },

        tick: function(ms) {
            this.clock.tick(ms || 25);
        },

        click: function(node) {
            var event;

            if (node.click) {
                node.click();
            }
            else if (node instanceof SVGElement) {
                event = document.createEvent("SVGEvents");
                event.initEvent("click",true,true);
                node.dispatchEvent(event);
            }
            else {
                event = document.createEvent("MouseEvent");
                event.initEvent("click",true,true);
                node.dispatchEvent(event);
            }
        }

    });

    return BrowserHelper;

});