define(function(require) {

    var Protoplast = require('protoplast');

    var HorizontalBar = Protoplast.Component.extend({

        html: '<div class="horizontal-bar--container" desciption="das">' +
                '<div data-prop="border" class="horizontal-bar--border"></div>' +
                '<div data-prop="bar" class="horizontal-bar--bar"></div>' +
            '</div>',

        width: null,

        height: null,

        value: null,

        $create: function() {
            this.$root = $(this.root);
            this.$bar = $(this.bar);
        },

        updateWidth: {
            bindWith: 'width',
            value: function(width) {
                this.$root.css('width', width);
                this.$bar.css('width', width * (this.value * 100) + '%');
            },
        },

        updateHeight: {
            bindWith: 'height',
            value: function(height) {
                this.$root.css('height', height);
            }
        },

        updateValue: {
            bindWith: 'value',
            value: function(value) {
                this.$bar.css('width', (value * 100).toFixed(0) + '%');
            }
        }

    });

    return HorizontalBar;
});