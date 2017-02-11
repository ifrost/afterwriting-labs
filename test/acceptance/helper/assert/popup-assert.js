define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var PopupAssert = BaseAssert.extend({

        /**
         * Asserts if file list is visible on the screen
         */
        file_list_is_visible: function() {
            chai.assert.ok(this.dom.popup.jstree_visible(), 'file list is not visible');
        },

        /**
         * Asserts if a dialog with a form is visible
         * @param {Boolean} value
         */
        dialog_form_is_visible: function(value) {
            chai.assert.strictEqual(this.dom.is_visible(this.dom.popup.$form_dialog), value);
        },

        /**
         * Asserts is dialog message matches given value
         * @param {String} value
         */
        dialog_message_is: function(value) {
            var message = this.dom.popup.dialog_message();
            chai.assert.strictEqual(value, message);
        },

        /**
         * Asserts if dialog input matches given value
         * @param {String} value
         */
        dialog_input_content_is: function(value) {
            var input = this.dom.popup.dialog_input();
            chai.assert.strictEqual(value, input);
        },

        /**
         * Asserts if a node with a given name is on the tree list
         * @param {String} name
         */
        tree_node_visible: function(name) {
            chai.assert.lengthOf(this.dom.popup.file_list_popup_with_node(name), 1);
        }
    });

    return PopupAssert;
});