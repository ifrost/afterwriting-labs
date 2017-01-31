define(function(require) {

    var Protoplast = require('protoplast');

    var BaseComponent = Protoplast.Component.extend({

        id: null,

        init: function() {
            Protoplast.utils.bind(this, 'id', this.updateId.bind(this));
        },

        updateId: function() {
            this.root.setAttribute('data-id', this.id);
        }

    });

    return BaseComponent;
});