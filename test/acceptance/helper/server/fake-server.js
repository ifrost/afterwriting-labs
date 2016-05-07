define(function(require){

    var p = require('p');

    var FakeServer = p.extend({

        resolve_xhr: function(xhr) {
            var url, method, content_type;
            for (var func in this.$meta.url) {
                url = this.$meta.url[func];
                content_type = this.$meta.content_type ? this.$meta.content_type[func] : "application/json";
                method = this.$meta.method ? this.$meta.method[func] : undefined;

                if (url.test(xhr.url) && (method === undefined || method === xhr.method)) {
                    try {
                        xhr.respond(200, { "Content-Type": content_type }, this[func](xhr));
                    } catch (e) {
                        xhr.respond(500, { "Content-Type": e.content_type || content_type }, e.message);
                    }
                }

            }
        }

    });

    return FakeServer;

});