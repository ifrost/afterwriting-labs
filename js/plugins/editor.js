define(function(require) {

    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/editor.hbs'),
        off = require('off'),
        gd = require('utils/googledrive'),
        db = require('utils/dropbox'),
        save = require('utils/save'),
        local = require('utils/local'),
        converter = require('utils/converters/scriptconverter'),
        cm = require('libs/codemirror/lib/codemirror');

    // codemirror plugins
    require('libs/codemirror/addon/selection/active-line');
    require('libs/codemirror/addon/hint/show-hint');
    require('libs/codemirror/addon/hint/anyword-hint');
    require('utils/fountain/cmmode');

    var Editor = Plugin.extend({

        name: 'editor',

        title: 'write',

        template: template,

        editor: null,

        last_content: '',

        active: false,

        auto_save_sync_timer: null,

        data: null,

        data_model: {
            inject: 'data'
        },

        layout: {
            inject: 'layout'
        },

        $create: function() {
            this.save_in_progress = off.property();
            this.pending_changes = off.property();
            this.synced = off.signal();

            // this.activate = off(this.activate.bind(this));
            // this.toggle_auto_save = off(this.toggle_auto_save.bind(this));
            // this.toggle_sync = off(this.toggle_sync.bind(this));

            this.data = {
                is_sync: false,
                is_auto_save: false
            }

        },

        create_editor: function(textarea) {
            this.editor = cm.fromTextArea(textarea, {
                mode: "fountain",
                lineNumbers: false,
                lineWrapping: true,
                styleActiveLine: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete"
                }
            });

            this.editor.on('change', function() {
                this.pending_changes(this.data_model.script() !== this.editor.getValue());
                this.data_model.script(this.editor.getValue());
            }.bind(this));
        },

        set_size: function(width, height) {
            this.editor.setSize(width, height);
            this.editor.refresh();
        },

        save_state: function() {
            this.data.cursor = this.editor.getCursor();
            this.data.scroll_info = this.editor.getScrollInfo();
        },

        goto: function(line) {
            this.data.cursor = {
                ch: 0,
                line: line,
                xRel: 0
            };
            this.data.scroll_info = null;

            this.layout.switch_to(this);
        },

        auto_save_available: function() {
            return (this.data_model.data('gd-fileid') || this.data_model.data('db-path')) && this.data_model.format !== 'fdx';
        },

        is_auto_save: function() {
            return this.data.is_auto_save;
        },

        toggle_auto_save: function() {
            if (!this.data.is_auto_save && this.data.is_sync) {
                this.toggle_sync();
            }
            this.set_auto_save(!this.data.is_auto_save);
        },

        set_auto_save: function(value) {
            this.data.is_auto_save = value;
            if (this.data.is_auto_save && !this.auto_save_sync_timer) {
                this.pending_changes(true); // trigger first save
                this.save_in_progress(false);
                this.auto_save_sync_timer = setInterval(this.save_current_script, 3000);
                this.save_current_script();
            }
            else {
                clearInterval(this.auto_save_sync_timer);
                this.auto_save_sync_timer = null;
                this.save_in_progress(false);
                this.pending_changes(false);
            }
        },

        save_current_script: function() {
            if (!this.save_in_progress() && this.pending_changes()) {
                this.save_in_progress(true);
                this.pending_changes(false);
                save.save_current_script(function() {
                    this.save_in_progress(false);
                }.bind(this));
            }
        },

        sync_available: function() {
            return this.data_model.data('gd-fileid') || this.data_model.data('db-path') || local.sync_available();
        },

        is_sync: function() {
            return this.data.is_sync;
        },

        handle_sync: function(content) {
            content = converter.to_fountain(content).value;
            if (content === undefined) {
                this.toggle_sync();
                if (this.active) {
                    this.activate();
                }
            }
            else if (this.last_content !== content) {
                this.last_content = content;
                this.data_model.script(content);
                this.data_model.parse();
                this.synced();
                if (this.active) {
                    this.activate();
                }
            }
        },

        toggle_sync: function() {
            this.last_content = '';
            this.set_sync(!this.data.is_sync);
        },

        store: function() {
            this.data_model.data('editor-last-state', this.data_model.script());
        },

        restore: function() {
            this.data_model.script(this.data_model.data('editor-last-state'));
            this.data_model.parse();
            if (this.active) {
                this.activate();
            }
        },

        set_sync: function(value) {
            this.data.is_sync = value;
            if (this.editor) {
                this.editor.setOption('readOnly', this.data.is_sync);
            }
            if (this.data.is_sync) {
                this.set_auto_save(false);
                if (this.data_model.data('gd-fileid')) {
                    gd.sync(this.data_model.data('gd-fileid'), 3000, this.handle_sync);
                    this.synced('google-drive');
                } else if (this.data_model.data('db-path')) {
                    db.sync(this.data_model.data('db-path'), 3000, this.handle_sync);
                    this.synced('drobox');
                } else if (local.sync_available()) {
                    local.sync(3000, this.handle_sync);
                    this.synced('local');
                }

            } else {
                gd.unsync();
                db.unsync();
                local.unsync();
            }
        },

        activate: function() {
            this.active = true;
            setTimeout(function() {
                if (this.data_model.script() !== this.editor.getValue()) this.editor.setValue(this.data_model.script() || "");
                this.editor.focus();
                this.editor.refresh();

                if (this.data.cursor) {
                    this.editor.setCursor(this.data.cursor);
                }

                if (this.data.scroll_info) {
                    this.editor.scrollTo(this.data.scroll_info.left, this.data.scroll_info.top);
                } else if (this.data.cursor) {
                    var scroll_to = this.editor.getScrollInfo();
                    if (scroll_to.top > 0) {
                        this.editor.scrollTo(0, scroll_to.top + scroll_to.clientHeight - this.editor.defaultTextHeight() * 2);
                    }
                }

            }.bind(this), 300);
        },

        deactivate: function() {
            this.active = false;
            this.save_state();
        },

        is_active: function() {
            return this.active;
        }
    });

    return Editor.create();
});