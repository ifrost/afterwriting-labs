define(function(require) {

    var FakeServer = require('acceptance/helper/server/fake-server'),
        FakeGapi = require('acceptance/helper/server/fake-gapi'),
        gd = require('utils/googledrive');

    /**
     * Mock the GoogleDrive API
     */
    var DropboxApi = FakeServer.extend({

        name: 'googledrive',

        gdInit: null,

        gapi: undefined,

        enabled: true,

        $create: function() {

        },

        enable: function() {
            this.enabled = true;
            window.gapi = this.gapi;
        },

        disable: function() {
            this.enabled = false;
            delete window.gapi;
        },

        setup: function() {
            this.gdInit = gd.init;

            gd.init = function() {
                this.gapi = FakeGapi.create();
                if (this.enabled) {
                    window.gapi = this.gapi;
                }
            }.bind(this);
        },

        auth_google_drive: function() {
            window.gapi.auth.commitInit();
        },

        restore: function() {
            gd.init = this.gdInit.bind(gd);
        },

        file_list: {
            url: /drive\/v2\/files/,
            method: 'GET',
            value: function() {
                return JSON.stringify({
                    items: []
                });
            }
        }
    });

    return DropboxApi;

});