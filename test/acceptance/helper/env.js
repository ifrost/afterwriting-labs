define(function(require) {

    var p = require('protoplast'),
        Dom = require('acceptance/helper/dom'),
        Assert = require('acceptance/helper/assert'),
        User = require('acceptance/helper/user'),
        Browser = require('acceptance/helper/browser'),
        Proxy = require('acceptance/helper/proxy'),
        FakeGoogleAnalytics = require('acceptance/helper/server/fake-ga'),
        FakeGoogleDrive = require('acceptance/helper/server/fake-google-drive'),
        FakeDropBox = require('acceptance/helper/server/fake-dropbox'),
        Scenarios = require('acceptance/helper/scenarios');

    /**
     * Main test environment that aggregates all helpers
     */
    var Env = p.extend({

        Bootstrap: null,

        Config: null,

        $create: function() {

            this.Bootstrap = window.testData.Bootstrap;
            this.Config = window.testData.Config;

            this.proxy = Proxy.create();
            this.dropbox = FakeDropBox.create();
            this.ga = FakeGoogleAnalytics.create();
            this.google_drive = FakeGoogleDrive.create();
            this.browser = Browser.create();
            this.dom = Dom.create();
            this.user = User.create(this.browser, this.dom);
            this.assert = Assert.create(this.dom, this.dropbox, this.ga);
            
            this.proxy.register_server(this.dropbox);
            this.proxy.register_server(this.google_drive);
            this.proxy.setup();
            
            this.ga.init(window);
            
            this.browser.setup();
            this.browser.tick(5000);
            this.Bootstrap.init(this.Config);

            this.browser.tick(5000);
            
            this.scenarios = Scenarios.create(this);
        },

        refresh: function() {
            this.Bootstrap.destroy();
            this.Bootstrap.init(this.Config);
            this.browser.tick(5000);
        },

        destroy: function() {
            this.user.back_to_main();

            this.Bootstrap.destroy();

            this.proxy.restore();
            this.browser.restore();
            this.ga.restore();
        }
    });

    return Env;
    
});