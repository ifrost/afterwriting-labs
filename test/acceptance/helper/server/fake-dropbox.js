define(function(require) {

    var p = require('p'),
        FakeServer = require('acceptance/helper/server/fake-server');

    /**
     * Mock the Dropbox API
     */
    var DropboxApi = FakeServer.extend({

        name: 'dropbox',
        
        files: null,

        contents: null,

        setup: function(proxy) {
            this.DropboxRequest = Dropbox.Util.Xhr.Request;
            sinon.stub(Dropbox.Util.Oauth, 'randomAuthStateParam', function() {
                return 'oauth_state';
            });
            Dropbox.Util.Xhr.Request = proxy.xhr;
            this.files = [];
            this.contents = {};
        },

        restore: function() {
            this.files = [];
            this.contents = {};
            Dropbox.Util.Xhr.Request = this.DropboxRequest;
            Dropbox.Util.Oauth.randomAuthStateParam.restore();
        },
        
        has_file: function(file) {
            this.contents[file.name] = file.content;
            this.files.push([
                '/' + file.name,
                {
                    bytes: file.content.length,
                    client_mtime: 'Wed, 21 Nov 2012 18:26:43 +0000',
                    icon: 'page_white_text',
                    is_dir: false,
                    mime_type: 'text/plain',
                    modified: 'Wed, 21 Nov 2012 18:26:43 +0000',
                    modifier: null,
                    path: '/' + file.name,
                    read_only: false,
                    rev: '1',
                    revision: 1,
                    root: 'dropbox',
                    size: '1 KB',
                    thumb_exists: false
                }
            ]);
        },

        delta: {
            url: /https:\/\/api(\d+).dropbox.com\/1\/delta/,
            method: 'POST',
            value: function() {
                return JSON.stringify({
                    has_more: false,
                    reset: false,
                    cursor: 'cursor',
                    entries: this.files
                });
            }
        },

        file_content: {
            url: /https:\/\/api-content.dropbox.com\/1\/files\/auto\/([0-9a-z.]+)/,
            method: 'GET',
            value: function(xhr, filename) {
                return this.contents[filename];
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