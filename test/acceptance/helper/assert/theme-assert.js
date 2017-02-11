define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var ThemeAssert = BaseAssert.extend({

        active_plugin_is: function(name) {
            chai.assert.strictEqual(this.dom.get_active_plugin(), name, 'Expected ' + name + ' plugin to be active, but ' + this.dom.get_active_plugin() + ' is active');
        },

        night_mode_is_enabled: function(value) {
            var night_mode = this.dom.is_night_mode();
            if (value) {
                chai.assert.ok(night_mode);
            }
            else {
                chai.assert.notOk(night_mode);
            }
        },

        content_is_expanded: function() {
            var content_size = this.dom.content_size(),
                window_size = this.dom.window_size();

            chai.assert.strictEqual(content_size.width, window_size.width);
        },

        content_is_not_expanded: function() {
            var content_size = this.dom.content_size(),
                window_size = this.dom.window_size();

            chai.assert.notEqual(content_size.width, window_size.width);
        }
        
    });

    return ThemeAssert;
});