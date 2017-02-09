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
        
        event_tracked_n_times: function(n, category, action, label) {
            var eventName = [category, action, label].filter(function(value){return value;}).join('/'),
                events = this.ga.getEvents(category, action, label).length;
            chai.assert.strictEqual(n, events, 'Event: ' + eventName + ' expected ' + n + ', but tracked ' + events + ' times');
        },

        content_is_expanded: function() {
            var content_size = this.dom.content_size(),
                window_size = this.dom.window_size();

            chai.assert.strictEqual(content_size.width, window_size.width);
        },

        content_is_not_expanded: function() {
            var content_size = this.dom.content_size(),
                window_size = this.dom.window_size();

            chai.assert.notEqual(content_size.width, window_size.width);
        },

        select_file_name_popup_is_visible: function() {
            chai.assert.lengthOf(this.dom.popup_with_message('Select file name'), 1);
        },
        
        dropbox_popup_visible: function() {
            return this.popup_tree_node_visible('Dropbox');
        },
        
        popup_tree_node_visible: function(name) {
            chai.assert.lengthOf(this.dom.file_list_popup_with_node(name), 1);
        },
        
        auto_reload_is_visible: function(value) {
            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$sync_button), value);
        },
        
        auto_save_visible: function(value) {
            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$auto_save_button), value);
        },

        save_to_google_drive_visible: function(plugin, format, value) {
            var method = '$save_' + format + '_google_drive';

            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom[method](plugin)), value);
        },

        save_to_dropbox_visible: function(plugin, format, value) {
            var method = '$save_' + format + '_dropbox';

            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom[method](plugin)), value);
        },
        
        open_from_google_drive_visible: function(value) {
            if (arguments.length === 0) {
                value = true;
            }
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$open_googledrive), value);
        },
        
        last_used_is_visible: function(value) {
            chai.assert.strictEqual(this.dom.is_visible(this.dom.$open_last_used), value);
        },
        
        last_used_title: function(title) {
            chai.assert.strictEqual(this.dom.open_last_used_title(), title)
        }

    });

    
    return Assert;
    
});