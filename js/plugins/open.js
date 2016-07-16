define(function(require) {

    var dependencies = require('dependencies'),
        Plugin = require('core/plugin'),
        template = require('text!templates/plugins/open.hbs'),
        samples = require('samples'),
        helper = require('utils/helper'),
        off = require('off'),
        $ = require('jquery'),
        gd = require('utils/googledrive'),
        db = require('utils/dropbox'),
        local = require('utils/local'),
        tree = require('utils/tree');

    /**
     * @extends Plugin
     */
    var Open = Plugin.extend({

        name: 'open',

        title: 'open',

        template: template,

        class: 'active',

        last_session_script: null,

        editor: {
            inject: 'editor'
        },

        layout: {
            inject: 'layout'
        },

        data: {
            inject: 'data'
        },

        save: {
            inject: 'save'
        },

        $create: function() {
            this.open_file_dialog = off.signal();
            this.last_session_script_loaded = false;
            this.context = {
                last_used: {}
            };
        },

        set_script: function(value) {
            this.clear_last_opened();
            this.editor.set_sync(false);
            this.editor.set_auto_save(false);
            this.data.script(value);
            this.layout.show_main();
        },

        clear_last_opened: function() {
            this.data.format = undefined;
            this.data.data('db-path', '');
            this.data.data('gd-link', '');
            this.data.data('gd-fileid', '');
            this.data.data('gd-pdf-id', '');
            this.data.data('db-pdf-path', '');
            this.data.data('fountain-filename', '');
            this.data.data('pdf-filename', '');
            local.local_file(null);
        },

        open_last_used: function(startup) {
            if (this.last_session_script_loaded) {
                this.set_script(this.last_session_script || '');
            }
            return startup;
        },

        open_file: function(selected_file) {
            var finished = off.signal();
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function() {
                var value = this.result;
                self.set_script(value);
                local.local_file(selected_file);
                finished(this.data.format);
            };

            fileReader.readAsText(selected_file);
            return finished;
        },

        create_new: function() {
            this.set_script('');
        },

        open_sample: function(name) {
            var file_name = 'samples/' + name + '.fountain';
            var text = samples[file_name]();
            this.set_script(text);
            return name;
        },

        is_dropbox_available: function() {
            return window.location.protocol !== 'file:';
        },

        is_google_drive_available: function() {
            return window.gapi && window.location.protocol !== 'file:';
        },

        open_from_cloud: function(client, back_callback, load_callback) {
            client.list(function(root) {
                root = typeof root !== 'function' ? client.convert_to_jstree(root) : root;
                tree.show({
                    info: 'Please select file to open.',
                    data: root,
                    label: 'Open',
                    search: !this.data.config.cloud_lazy_loading,
                    callback: function(selected) {
                        if (selected.data.isFolder) {
                            $.prompt('Please select a file, not folder.', {
                                buttons: {
                                    'Back': true,
                                    'Cancel': false
                                },
                                submit: function(v) {
                                    if (v) {
                                        back_callback();
                                    }
                                }
                            });
                        } else {
                            load_callback(selected);
                        }
                    }
                });
            }.bind(this), {
                before: function() {
                    $.prompt('Please wait...');
                },
                after: $.prompt.close,
                lazy: this.data.config.cloud_lazy_loading
            });
        },

        open_from_dropbox: function() {
            var finished = off.signal();
            this.open_from_cloud(db, this.open_from_dropbox, function(selected) {
                db.load_file(selected.data.path, function(content) {
                    this.set_script(content);
                    this.data.data('db-path', selected.data.path);
                    finished(this.data.format);
                }.bind(this));
            }.bind(this));
            return finished;
        },

        open_from_google_drive: function() {
            var finished = off.signal();
            this.open_from_cloud(gd, this.open_from_google_drive, function(selected) {
                gd.load_file(selected.data.id, function(content, link, fileid) {
                    this.set_script(content);
                    this.data.data('gd-link', link);
                    this.data.data('gd-fileid', fileid);
                    this.data.data('gd-parents', selected.parents.slice(0, selected.parents.length - 2).reverse());
                    finished(this.data.format);
                }.bind(this));
            }.bind(this));
            return finished;
        },

        prepare: function() {
            this.logger.info('Loading last used');

            if (this.data.data('last-used-date')) {
                this.data.data('filename', '');
                this.logger.info('Last used exists. Loading: ', this.data.data('last-used-title'), this.data.data('last-used-date'));
                this.context.last_used.script = this.data.data('last-used-script');
                this.context.last_used.date = this.data.data('last-used-date');
                this.context.last_used.title = this.data.data('last-used-title');
                this.last_session_script = this.data.data('last-used-script');
                this.last_session_script_loaded = true;
            }

            this.logger.info("Init: script handlers");

            this.data.script.add(function() {
                var title = '';
                this.data.data('last-used-script', this.data.script());
                this.data.data('last-used-date', helper.format_date(new Date()));
                if (this.data.script()) {
                    var title_match;
                    var wait_for_non_empty = false;
                    this.data.script().split('\n').some(function(line) {
                        title_match = line.match(/title\:(.*)/i);
                        if (wait_for_non_empty) {
                            title = line.trim().replace(/\*/g, '').replace(/_/g, '');
                            wait_for_non_empty = !title;
                        }
                        if (title_match) {
                            title = title_match[1].trim();
                            wait_for_non_empty = !title;
                        }
                        return title && !wait_for_non_empty;
                    });
                }
                this.data.data('last-used-title', title || 'No title');
            }.bind(this));

            this.save.gd_saved.add(function(item) {
                this.clear_last_opened();
                this.data.data('gd-link', item.alternateLink);
                this.data.data('gd-fileid', item.id);
                this.data.data('filename', '');
                if (this.editor.is_active) {
                    this.editor.activate(); // refresh
                }
            }.bind(this));

            this.save.db_saved.add(function(path) {
                this.clear_last_opened();
                this.data.data('db-path', path);
                this.data.data('filename', '');
                if (this.editor.is_active) {
                    this.editor.activate(); // refresh
                }
            }.bind(this));
        }

    });

    return Open.create();
});