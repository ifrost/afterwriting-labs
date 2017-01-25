define(function(require) {

    var Protoplast = require('p'),
        converter = require('utils/converters/scriptconverter'),
        gd = require('utils/googledrive'),
        db = require('utils/dropbox'),
        save = require('utils/save'),
        local = require('utils/local'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        EditorModel = require('plugin/editor/model/editor-model');

    var EditorController = Protoplast.Object.extend({
        
        scriptModel: {
            inject: 'script'
        },
        
        editorModel: {
            inject: EditorModel
        },

        themeController: {
            inject: ThemeController
        },
        
        autoSaveSyncTimer: null,

        cleanUp: function() {
            if (this.editorModel.isAutoSaveEnabled) {
                this.toggleAutoSave();
            }
            if (this.editorModel.isSyncEnabled) {
                this.toggleSync();
            }
        },

        toggleAutoSave: function() {
            if (!this.editorModel.isAutoSaveEnabled && this.editorModel.isSyncEnabled) {
                this.editorModel.toggleSync();
            }
            this.setAutoSave(!this.editorModel.isAutoSaveEnabled);
        },

        toggleSync: function() {
            this.editorModel.toggleSync();
            if (this.editorModel.isSyncEnabled) {
                this.setAutoSave(false);
                if (this.scriptModel.data('gd-fileid')) {
                    gd.sync(this.scriptModel.data('gd-fileid'), 3000, this._handleSync);
                    // plugin.syced('google-drive');
                } else if (this.scriptModel.data('db-path')) {
                    db.sync(this.scriptModel.data('db-path'), 3000, this._handleSync);
                    // plugin.synced('drobox');
                } else if (local.sync_available()) {
                    local.sync(3000, this._handleSync);
                    // plugin.synced('local');
                }
            }
            else {
                gd.unsync();
                db.unsync();
                local.unsync();
            }
        },

        _handleSync: function(content) {
            content = converter.to_fountain(content).value;
            if (content === undefined) {
                this.toggleSync();
                // if (active) {
                //     plugin.activate();
                // }
            }
            else if (this.editorModel.lastContent !== content) {
                this.editorModel.lastContent = content;
                this.scriptModel.script(content);
                this.scriptModel.parse();
                //plugin.synced();
                // if (active) {
                //     plugin.activate();
                // }
            }
        },
        
        setAutoSave: function(value) {
            this.editorModel.isAutoSaveEnabled = value;
            if (this.editorModel.isAutoSaveEnabled && !this.autoSaveSyncTimer) {
                this.editorModel.pendingChanges = true; // trigger first save
                this.editorModel.saveInProgress = false;
                this.autoSaveSyncTimer = setInterval(this.saveCurrentScript, 3000);
                this.saveCurrentScript();
            }
            else {
                clearInterval(this.autoSaveSyncTimer);
                this.autoSaveSyncTimer = null;
                this.editorModel.pendingChanges = false; 
                this.editorModel.saveInProgress = false;
            }
        },
        
        saveCurrentScript: function() {
            if (!this.editorModel.saveInProgress && this.editorModel.pendingChanges) {
                this.editorModel.pendingChanges = false;
                this.editorModel.saveInProgress = true;
                save.save_current_script(function(){
                    this.editorModel.saveInProgress = false;
                }.bind(this));
            }
        },
        
        goto: function(line) {
            this.editorModel.cursorPosition = {
                ch: 0,
                line: line,
                xRel: 0
            };
            this.editorModel.scrollInfo = null;

            this.themeController.selectSectionByName('editor');
        }
        
    });

    return EditorController;
});