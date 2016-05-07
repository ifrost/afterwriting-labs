define(function(require) {

    var $ = require('jquery'),
        Proxy = require('../helper/proxy'),
        FakeDropBox = require('../helper/server/fake-dropbox');

    var env = {};

    var proxy = Proxy.create();
    proxy.register_server(FakeDropBox.create());

    env.setup = function() {
        proxy.setup();
        window.clock = sinon.useFakeTimers();
        sinon.stub(window, 'open', function() {return {close: function() {}}});
        window.clock.tick(5000);
    };

    env.restore = function() {
        proxy.restore();
        window.clock.restore();
        window.open.restore();
    };
    
    env.auth_dropbox = function() {
        var event = document.createEvent('CustomEvent');
        event.initEvent('message');
        event.origin = 'http://localhost:8000';
        event.data = 'access_token=DROPBOX_TOKEN&uid=1&state=oauth_state';
        window.dispatchEvent(event);
        window.clock.tick(1000);
    };

    env.clear_cookies = function() {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    };

    return env;
    
});