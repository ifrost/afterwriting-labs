define(function(require) {

    var $ = require('jquery'),
        Protoplast = require('protoplast');

    var BaseUserHelper = Protoplast.extend({

        $create: function(browser, dom) {
            this.browser = browser;
            this.dom = dom;
        },

        type: function(selector, char) {
            var value = $(selector).prop('value');
            var e = $.Event('keyup');
            e.which = char.charCodeAt(0);
            $(selector).prop('value', value + char);
            $(selector).trigger(e);
        },

        click: function(selector) {
            // TODO: decide on error handling convention (+)
            try {
                this.browser.click($(selector).get(0));
            }
            catch (e) {
                if (e === "NodeDoesNotExist") {
                    throw new Error('Cannot click on selector "' + selector + '". Element not found.');
                }
            }
            // previously tick(20000), replaced with a series of ticks to fix loading fonts dynamically (too long
            // single tick causes timeouts in requirejs()
            for (var i=0; i<100; i++) {
                this.browser.tick(20);
            }
        },
        
        click_button: function(label) {
            this.click(this.dom.theme.$button(label));
        },

        create_event: function(type, options) {
            var event = $.Event(type, options);
            return event;
        },

        trigger_event: function(selector, type, options) {
            var event = this.create_event(type, options);
            $(selector).trigger(event);
            this.browser.tick(10);
        },

        trigger_mouse_event: function(selector, type, options) {
            options.pageX = options.pageX || options.x;
            options.pageY = options.pageY || options.y;
            options.clientX = options.clientX || options.x;
            options.clientY = options.pageX || options.y;
            options.which = options.which || 1;

            this.trigger_event(selector, type, options);
        },

        set_value: function(selector, value) {
            $(selector).prop("value", value);
            this.trigger_event(selector, "change");
        }

    });

    return BaseUserHelper;
});