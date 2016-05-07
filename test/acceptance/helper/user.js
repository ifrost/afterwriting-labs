define(function(require) {

    var p = require('p');

    /**
     * Performs user actions
     */
    var User = p.extend({

        $create: function(browser, dom) {
            this.browser = browser;
            this.dom = dom;
        },

        click: function(selector) {
            $(selector).click();
            this.browser.tick(20000);
        },

        back_to_main: function() {
            this.click(this.dom.$background);
        },

        open_plugin: function(name) {
            this.click(this.dom.$plugin(name));
        },

        open_from_dropbox: function() {
            this.click(this.dom.$open_dropbox);
        },

        close_popup: function() {
            this.click(this.dom.$close_popup);
        }

    });

    return User;
    
});