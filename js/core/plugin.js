define(function(require) {
    
    var Module = require('core/module'),
        Handlebars = require('handlebars');
    
    var Plugin = Module.extend({
        
        is_plugin: true,

        title: '',

        template: null,

        data: null,

        context: null,

        $create: function(name, title, template) {
            this.title = title;
            if (template) {
                this.template = Handlebars.compile(template);
            }
            this.class = 'inactive';
            this.data = {};
            this.context = {};
        },

        activate: function() {
        },

        deactivate: function() {
        }

    });
    
    return Plugin;

});