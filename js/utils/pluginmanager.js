define(function(require) {

    var Handlebars = require('handlebars'),
        Protoplast = require('aw-bubble/vendor/protoplast'),
        Section = require('aw-bubble/model/section'),
        logger = require('logger'),
        data = require('modules/data'),
        decorator = require('utils/decorator');

    var log = logger.get('pluginmanager');

    var module = {},
        current;
    
    module.create_plugin = function(name, title, template, section) {
        var component;
        if (template) {
            template = Handlebars.compile(template);
        }

        if (!section) {
            component = Protoplast.Component.extend({
                html: template(),
                start: {
                    sub: 'bubble-theme/init',
                    value: function() {
                        
                    }
                }
            }).create();

            section = Section.create(name);
            section.title = title;
            section.shortTitle = title;
            section.smallIcon = 'gfx/icons/' + name + '.svg';
            section.mainContent = component;
        }
        
        var plugin = {
            section: section,
            is_plugin: true,
            activate: function() {
            },
            deactivate: function() {
            },
            context: {},
            init: function() {
            },
            data: {},
            name: name || section.name,
            title: title || section.title,
            class: 'inactive',
            template: template,
            log: logger.get('name')
        };

        var pm = this;
        section.mainContent.plugin = plugin;
        Protoplast.utils.bind(section, 'isActive', function(section) {
            if (!this.isActive && section.isActive) {
                pm.switch_to(this);
            }
        }.bind(plugin, section));

        return plugin;
    };

    module.switch_to = decorator(function(plugin) {
        if (plugin === current) {
            module.switch_to.lock = true;
            return;
        }

        log.info('Switching to: ' + plugin.name);

        if (current) {
            current.deactivate();
        }
        current = plugin;

        data.parse();

        current.activate();

        return current;
    });

    module.refresh = function() {
        if (current) {
            current.deactivate();
            current.activate();
        }
    };

    module.get_current = function() {
        return current;
    };

    return module;
});