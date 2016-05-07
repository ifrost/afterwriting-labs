define(function(require) {

    var p = require('p');

    var Proxy = p.extend({

        $create: function() {
            this.servers = [];
        },

        setup: function() {
            var self = this;
            this.xhr = sinon.useFakeXMLHttpRequest();
            this.xhr.onCreate = function(xhr) {
                xhr.send = function() {
                    self.resolve(xhr);
                }
            };
            this.servers.forEach(function(server) {
                server.setup(this);
            }, this);
        },

        restore: function() {
            this.xhr.restore();
            this.servers.forEach(function(server) {
                server.restore(this);
            }, this);
        },

        register_server: function(server) {
            this.servers.push(server);
        },

        resolve: function(xhr) {
            this.servers.every(function(server) {
                return server.resolve_xhr(xhr);
            });
        }

    });

    return Proxy;

});