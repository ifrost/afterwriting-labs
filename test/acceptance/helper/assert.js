define(function(require) {

    var dom  = require('../helper/dom'),
        assert = {};
    
    assert.active_plugin_is = function(name) {
        chai.assert.strictEqual(name, dom.get_active_plugin());
    };
    
    return assert;
    
});