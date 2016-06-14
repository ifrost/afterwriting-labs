define(function(require) {

    var p = require('p'),
        off = require('off'),
        logger = require('logger');

    var Module = p.extend({

        $meta: {
            constructors: [p.constructors.autobind]
        },

        name: '',

        logger: null,

        $create: function(name) {
            this.name = this.name || name;
            this.logger = logger.get(name);
            off.decorate(this);
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