define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var EditorAssert = BaseAssert.extend({
        
        auto_reload_is_visible: function(value) {
            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$sync_button), value);
        },

        editor_content: function(content) {
            chai.assert.equal(this.dom.editor_content(), content, "editor's content does not match expected value");
        },

        auto_save_visible: function(value) {
            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$auto_save_button), value);
        }

    });

    return EditorAssert;
});