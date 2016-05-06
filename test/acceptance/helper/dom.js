define(function() {

    var dom = {};
    
    dom.get_active_plugin = function() {
        return $('.plugin-content.active').attr('plugin');
    };

    return dom;
    
});