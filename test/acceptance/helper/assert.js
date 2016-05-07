define(function(require) {

    var dom  = require('../helper/dom'),
        assert = {};
    
    assert.active_plugin_is = function(name) {
        chai.assert.strictEqual(name, dom.get_active_plugin(), 'Expected ' + name + ' plugin to be active, but ' + dom.get_active_plugin() + ' is active');
    };

    assert.file_list_is_visible = function() {
        chai.assert.ok(dom.jstree_visible(), 'file list is not visible');
    };
    
    return assert;
    
});