define(function(require) {

    var FakeServer = require('acceptance/helper/server/fake-server'),
        db = require('utils/dropbox');

    /**
     * Mock the Dropbox API
     */
    var DropboxApi = FakeServer.extend({

        name: 'dropbox',
        
        files: null,

        contents: null,

        saved_count: null,

        enabled: true,

        $create: function() {
            this.saved_count = 0;
        },
        
        enable: function() {
            db.initialised = true;
            this.enabled = true;
        },
        
        disable: function() {
            db.initialised = false;
            this.enabled = false;
        },

        setup: function() {
            this.files = [];
            this.contents = {};
        },

        restore: function() {
            this.files = [];
            this.contents = {};
        },
        
        has_file: function(file) {
            this.contents[file.name] = file.content;
            this.files.push({
                id: file.name,
                '.tag': 'file',
                path_lower: '/' + file.name,
                name: file.name
            });
        },

        list_folder: {
            url: /https:\/\/api.dropboxapi.com\/2\/files\/list_folder/,
            content_type: 'application/json',
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

        download: {
            url: /https:\/\/content.dropboxapi.com\/2\/files\/download/,
            method: 'POST',
            content_type: 'application/octet-stream',
            value: function(xhr) {
                var requestedFileName = JSON.parse(xhr.requestHeaders["Dropbox-API-Arg"]).path;
                // strip "/"
                
                this.headers = {
                    'dropbox-api-result': JSON.stringify(this.files[0])
                };
                return this.contents[requestedFileName.substr(1)];
            }
        },

        save_content: {
            url: /https:\/\/content.dropboxapi.com\/2\/files\/upload/,
            method: 'POST',
            value: function() {
                if (!this.enabled) {
                    throw new Error();
                }
                this.saved_count++;
                return JSON.stringify({
                    bytes: 10,
                    client_mtime: 'Wed, 21 Nov 2012 18:26:43 +0000',
                    icon: 'page_white_text',
                    is_dir: false,
                    mime_type: 'text/plain',
                    modified: 'Wed, 21 Nov 2012 18:26:43 +0000',
                    modifier: null,
                    path: '/file.fountain',
                    read_only: false,
                    rev: '1',
                    revision: 1,
                    root: 'dropbox',
                    size: '1 KB',
                    thumb_exists: false
                });
            }
        },

        auth_dropbox: function() {
            var event = document.createEvent('CustomEvent');
            event.initEvent('message');
            event.origin = 'http://localhost:8000';
            event.data = 'access_token=DROPBOX_TOKEN&uid=1';
            window.dispatchEvent(event);
        },

        content_change: function(filename, content) {
            if (this.contents[filename]) {
                this.contents[filename] = content;
            }
            else {
                throw new Error('File ' + filename + ' does not exist');
            }
        }

    });

    return DropboxApi;

});