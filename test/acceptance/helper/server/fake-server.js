define(function(require){

    var p = require('p');

    /**
     * Fake server allowing to create custom mappings for test requests, e.g.
     * FaksServer.extend({
     *      foo: {
     *          url: /regexp/,
     *          method: 'POST', // any method if not set
     *          value: function() {
     *              return 'result'; // String returned in response, throw Error for error responses
     *          }
     *      }
     * })
     */
    var FakeServer = p.extend({

        /**
         * Runs the mapped function if urls and method match
         * @param xhr
         */
        resolve_xhr: function(xhr) {
            this.each_endpoint(function(opts) {
                if (opts.url.test(xhr.url) && (opts.method === undefined || opts.method === xhr.method)) {
                    try {
                        xhr.respond(200, { "Content-Type": opts.content_type }, opts.call(xhr));
                    } catch (e) {
                        xhr.respond(500, { "Content-Type": e.content_type || opts.content_type }, e.message);
                    }
                }
            }.bind(this));
        },

        /**
         * Runs callback with each registered endpoint passing the object with endpoint settings
         * @param callback
         */
        each_endpoint: function(callback) {
            for (var func in this.$meta.url) {
                url = this.$meta.url[func];
                content_type = this.$meta.content_type ? this.$meta.content_type[func] : "application/json";
                method = this.$meta.method ? this.$meta.method[func] : undefined;
                call = this[func].bind(this);

                callback({
                    url: url,
                    content_type: content_type,
                    method: method,
                    call: call
                });
            }
        }

    });

    return FakeServer;

});