define(function() {

    var dom = {};
    
    dom.get_active_plugin = function() {
        return $('.plugin-content.active').attr('plugin');
    };

    dom.jstree_visible = function() {
        return !!$('.jstree-anchor').attr('id');
    };

    return dom;
    
});