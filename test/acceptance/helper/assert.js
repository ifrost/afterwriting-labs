define(function(require) {

    var p = require('p');

    /**
     * Performs assertions, all chai/sinon assertions go here
     */
    var Assert = p.extend({

        $create: function(dom) {
            this.dom = dom;
        },

        active_plugin_is: function(name) {
            chai.assert.strictEqual(name, this.dom.get_active_plugin(), 'Expected ' + name + ' plugin to be active, but ' + this.dom.get_active_plugin() + ' is active');
        },

        file_list_is_visible: function() {
            chai.assert.ok(this.dom.jstree_visible(), 'file list is not visible');
        },
        
        editor_content: function(content) {
            chai.assert.equal(this.dom.editor_content(), content, "editor's content does not match expected value");
        }
    });

    
    return Assert;
    
});