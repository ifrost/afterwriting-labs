define(function(require) {

    var p = require('p'),
        FakeServer = require('acceptance/helper/server/fake-server');

    /**
     * Mock the Dropbox API
     */
    var DropboxApi = FakeServer.extend({

        name: 'dropbox',

        setup: function(proxy) {
            this.DropboxRequest = Dropbox.Util.Xhr.Request;
            sinon.stub(Dropbox.Util.Oauth, 'randomAuthStateParam', function() {
                return 'oauth_state';
            });
            Dropbox.Util.Xhr.Request = proxy.xhr;
        },

        restore: function() {
            Dropbox.Util.Xhr.Request = this.DropboxRequest;
            Dropbox.Util.Oauth.randomAuthStateParam.restore();
        },

        delta: {
            url: /https:\/\/api(\d+).dropbox.com\/1\/delta/,
            method: 'POST',
            value: function() {
                return JSON.stringify({
                    has_more: false,
                    reset: false,
                    cursor: 'cursor',
                    entries: []
                });
            }
        },

        auth_dropbox: function() {
            var event = document.createEvent('CustomEvent');
            event.initEvent('message');
            event.origin = 'http://localhost:8000';
            event.data = 'access_token=DROPBOX_TOKEN&uid=1&state=oauth_state';
            window.dispatchEvent(event);
        }

    });

    return DropboxApi;

});