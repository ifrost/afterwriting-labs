define(function(require) {

    var BaseDomHelper = require('acceptance/helper/dom/base-dom-helper');

    var PopupDomHelper = BaseDomHelper.extend({

        /**
         * Form in a dialog
         */
        $form_dialog: 'form.jqiform',

        /**
         * Confirm button on a popup
         */
        $confirm_popup: '[name=jqi_state0_buttonOpen]',

        /**
         * Dialog message displayed in the popup
         * @returns {String}
         */
        dialog_message: function() {
            return $('.jqimessage').text();
        },

        /**
         * Dialog's input content
         * @returns {String}
         */
        dialog_input: function() {
            return $('.jqiform .text_input').prop('value');
        },

        /**
         * Tree node with a name containing given value
         * @param {String} text
         * @returns {jQuery}
         */
        file_list_popup_with_node: function(text) {
            return $('.jstree a:contains(' + text + ')');
        },

        /**
         * Link to a file on a tree-list
         * @param {String} filename
         * @returns {String}
         */
        $file_link: function(filename) {
            return "[aria-labelledby='/" + filename + "_anchor'] a";
        },

        /**
         * True if tree is visible
         * @returns {Boolean}
         */
        jstree_visible: function() {
            return !!$('.jstree-anchor').attr('id');
        }

    });

    return PopupDomHelper;
});