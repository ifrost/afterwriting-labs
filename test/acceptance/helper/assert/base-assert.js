define(function(require) {

    var Protoplast = require('protoplast');

    var BaseAssert = Protoplast.extend({

        $create: function(dom, dropbox, ga) {
            this.dom = dom;
            this.dropbox = dropbox;
            this.ga = ga;
        }

    });

    return BaseAssert;
});