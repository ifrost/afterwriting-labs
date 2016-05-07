define(function(require) {

    var p = require('p'),
        Dom = require('acceptance/helper/dom'),
        Assert = require('acceptance/helper/assert'),
        User = require('acceptance/helper/user'),
        Browser = require('acceptance/helper/browser'),
        Proxy = require('acceptance/helper/proxy'),
        FakeDropBox = require('acceptance/helper/server/fake-dropbox');

    /**
     * Main test environment that aggregates all helpers
     */
    var Env = p.extend({

        $create: function() {

            this.proxy = Proxy.create();
            this.dropbox = FakeDropBox.create();
            this.browser = Browser.create();
            this.dom = Dom.create();
            this.user = User.create(this.browser, this.dom);
            this.assert = Assert.create(this.dom);

            this.proxy.register_server(this.dropbox);
            this.proxy.setup();
            
            this.browser.setup();
            this.browser.tick(5000);
        },

        destroy: function() {
            this.user.back_to_main();
            this.proxy.restore();
            this.browser.restore();
        }
    });

    return Env;
    
});