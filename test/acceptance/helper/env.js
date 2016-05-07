define(function(require) {

    var $ = require('jquery');

    var env = {};

    env.setup = function() {

        window.xhr = sinon.useFakeXMLHttpRequest();
        window.clock = sinon.useFakeTimers();

        Dropbox.Util.Xhr.Request = window.xhr;

        sinon.stub(window, 'open', function() {return {close: function() {}}});

        sinon.stub(Dropbox.Util.Oauth, 'randomAuthStateParam', function() {
            return 'oauth_state';
        });

        window.xhr.onCreate = function(xhr) {
            xhr.send = function() {
                if (/https:\/\/api(\d+).dropbox.com\/1\/delta/.test(xhr.url)) {
                    xhr.respond(200,  { "Content-Type": "application/json" },JSON.stringify({
                        has_more: false,
                        reset: false,
                        cursor: 'cursor',
                        entries: []
                    }));
                }
            }
        };

        window.clock.tick(5000);
    };

    env.restore = function() {
        window.xhr.restore();
        window.clock.restore();
        window.open.restore();
        Dropbox.Util.Oauth.randomAuthStateParam.restore();
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