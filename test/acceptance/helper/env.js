define(function(require) {

    var p = require('p'),
        Browser = require('acceptance/helper/browser'),
        Proxy = require('acceptance/helper/proxy'),
        FakeDropBox = require('acceptance/helper/server/fake-dropbox');

    var Env = p.extend({

        setup: function() {

            this.proxy = Proxy.create();
            this.dropbox = FakeDropBox.create();
            this.proxy.register_server(this.dropbox);

            this.browser = Browser.create();

            this.proxy.setup();
            this.browser.setup();

            this.browser.tick(5000);
        },

        restore: function() {
            this.proxy.restore();
            this.browser.restore();
        }
    });

    return Env;
    
});