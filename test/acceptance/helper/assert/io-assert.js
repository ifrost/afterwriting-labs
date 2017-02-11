define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var IoAssert = BaseAssert.extend({

        // generic
        
        // open

        last_used_is_visible: function(value) {
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$open_last_used), value);
        },

        last_used_title: function(title) {
            chai.assert.strictEqual(this.dom.open_last_used_title(), title)
        },

        open_from_google_drive_visible: function(value) {
            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$open_googledrive), value);
        },
        
        // save

        save_to_dropbox_visible: function(plugin, format, value) {
            var method = '$save_' + format + '_dropbox';

            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom[method](plugin)), value);
        },
        
        save_to_google_drive_visible: function(plugin, format, value) {
            var method = '$save_' + format + '_google_drive';

            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom[method](plugin)), value);
        }
    });

    return IoAssert;
});