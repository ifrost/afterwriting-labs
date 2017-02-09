define(function(require) {

    var Protoplast = require('protoplast'),
        $ = require('jquery');

    var BaseComponent = Protoplast.Component.extend({

        $meta: {
            elementWrapper: $
        },
        
        id: undefined,

        hbs: null,

        _selectors: null,


        $create: function() {
            this._selectors = Protoplast.Collection.create();
            if (this.hbs) {
                this.root.innerHTML = Handlebars.compile(this.hbs)();
            }
            this.$root = $(this.root);
            this.processRoot();
        },
        
        init: function() {
            Protoplast.utils.bind(this, 'id', this._updateId.bind(this));
            this.addBindings();
            this.addInteractions();
        },
        
        addBindings: function() {},

        addInteractions: function() {},

        $on: function(selector, event, handler) {
            this._selectors.add(selector);
            this.$root.find(selector).on(event, handler);
        },

        onClick: function(selector, handler) {
            this.$on(selector, 'click', handler);
        },
        
        _updateId: function() {
            this.root.setAttribute('data-id', this.id);
        },

        destroy: function() {
            this._selectors.forEach(function(selector) {
                this.$root.find(selector).off();
            }, this);
            Protoplast.Component.destroy.call(this);
        }
        
    });

    return BaseComponent;
});