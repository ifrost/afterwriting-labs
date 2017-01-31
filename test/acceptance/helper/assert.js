define(function(require) {

    var p = require('protoplast');

    /**
     * Performs assertions, all chai/sinon assertions go here
     */
    var Assert = p.extend({

        $create: function(dom, dropbox, ga) {
            this.dom = dom;
            this.dropbox = dropbox;
            this.ga = ga;
        },

        active_plugin_is: function(name) {
            chai.assert.strictEqual(this.dom.get_active_plugin(), name, 'Expected ' + name + ' plugin to be active, but ' + this.dom.get_active_plugin() + ' is active');
        },

        file_list_is_visible: function() {
            chai.assert.ok(this.dom.jstree_visible(), 'file list is not visible');
        },
        
        editor_content: function(content) {
            chai.assert.equal(this.dom.editor_content(), content, "editor's content does not match expected value");
        },

        dropbox_saved: function(count) {
            chai.assert.equal(this.dropbox.saved_count, count, 'content has been saved ' + this.dropbox.saved_count + ', expected: ', count);
        },

        night_mode_is_enabled: function(value) {
           var night_mode = this.dom.is_night_mode();
           if (value) {
              chai.assert.ok(night_mode);
           }
           else {
              chai.assert.notOk(night_mode);
           }
        },
        
        event_tracked: function(category, action, label) {
            var eventName = [category, action, label].filter(function(value){return value;}).join('/');
            chai.assert.ok(this.ga.hasEvent(category, action, label), 'Event: ' + eventName + ' not found');
        },

        event_not_tracked: function(category, action, label) {
            var eventName = [category, action, label].filter(function(value){return value;}).join('/');
            chai.assert.ok(!this.ga.hasEvent(category, action, label), 'Event: ' + eventName + ' was tracked');
        }

    });

    
    return Assert;
    
});