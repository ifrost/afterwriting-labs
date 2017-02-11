define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var PopupAssert = BaseAssert.extend({

        file_list_is_visible: function() {
            chai.assert.ok(this.dom.jstree_visible(), 'file list is not visible');
        },

        select_file_name_popup_is_visible: function() {
            chai.assert.lengthOf(this.dom.popup_with_message('Select file name'), 1);
        },

        dropbox_popup_visible: function() {
            return this._popup_tree_node_visible('Dropbox');
        },

        google_drive_popup_visible: function() {
            return this._popup_tree_node_visible('My Drive');
        },

        dialog_is_visible: function(value) {
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$form_dialog), value);
        },

        dialog_message_is: function(value) {
            var message = this.dom.dialog_message();
            chai.assert.strictEqual(value, message);
        },

        input_content_is: function(value) {
            var input = this.dom.dialog_input();
            chai.assert.strictEqual(value, input);
        },

        _popup_tree_node_visible: function(name) {
            chai.assert.lengthOf(this.dom.file_list_popup_with_node(name), 1);
        }
    });

    return PopupAssert;
});