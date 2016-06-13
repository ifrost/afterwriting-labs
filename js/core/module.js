define(function(require) {

    var p = require('p'),
        logger = require('logger');

    var Module = p.extend({

        name: '',

        logger: null,

        $create: function(name) {
            this.name = name;
            this.logger = logger.get(name);
        },

        prepare: {
            inject_init: true,
            value: function() {}
        },

        windup: {
            inject_post_init: true,
            value: function() {}
        }

    });

    return Module;

});