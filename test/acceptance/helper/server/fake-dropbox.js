define(function(require) {

    var p = require('p'),
        FakeServer = require('acceptance/helper/server/fake-server');

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
        }

    });

    return DropboxApi;

});