define(function(require) {

    var $ = require('jquery'),
        Protoplast = require('p'),
        BaseSectionViewPresenter = require('aw-bubble/presenter/base-section-view-presenter'),
        local = require('utils/local'),
        EditorController = require('plugin/editor/controller/editor-controller'),
        EditorModel = require('plugin/editor/model/editor-model');

    var EditorViewPresenter = BaseSectionViewPresenter.extend({

        scriptModel: {
            inject: 'script'
        },

        editorModel: {
            inject: EditorModel
        },

        editorController: {
            inject: EditorController
        },
        
        init: function() {
            BaseSectionViewPresenter.init.call(this);

            this.view.on('editorContentChanged', this._editorContentChanged, this);
            this.view.on('disableSync', this._disableSync, this);
            this.view.on('enableSync', this._enableSync, this);
            this.view.on('toggleAutoSave', this._toggleAutoSave, this);
            
            Protoplast.utils.bindProperty(this.editorModel, 'isSyncEnabled' , this.view, 'isSyncEnabled');
            Protoplast.utils.bindProperty(this.editorModel, 'isAutoSaveEnabled' , this.view, 'isAutoSaveEnabled');
            Protoplast.utils.bindProperty(this.editorModel, 'saveInProgress' , this.view, 'saveInProgress');
            Protoplast.utils.bindProperty(this.editorModel, 'pendingChange' , this.view, 'pendingChanges');

            this.scriptModel.bindScript(function() {
                this.view.content = this.scriptModel.script();
            }.bind(this));
        },

        activate: function() {
            BaseSectionViewPresenter.activate.call(this);
            this.view.autoSaveAvailable = !!((this.scriptModel.data('gd-fileid') || this.scriptModel.data('db-path')) && this.scriptModel.format !== 'fdx');
            this.view.syncAvailable = !!(this.scriptModel.data('gd-fileid') || this.scriptModel.data('db-path') || local.sync_available());

            setTimeout(function () {
                this.view.content = this.scriptModel.script();
                this.view.refresh();

                if (this.editorModel.cursorPosition) {
                    this.view.setCursor(this.editorModel.cursorPosition);
                }

                if (this.editorModel.scrollInfo) {
                    this.view.scrollTo(this.editorModel.scrollInfo.left, this.editorModel.scrollInfo.top);
                }
                else if (this.editorModel.cursorPosition) {
                    var scrollTo = this.view.getScrollInfo();
                    if (scrollTo.top > 0) {
                        this.view.scrollTo(0, scrollTo.top + scrollTo.clientHeight - this.view.getDefaultTextHeight() * 2);
                    }
                }

            }.bind(this), 300);
        },

        _restore: function() {
            this.scriptModel.script(this.scriptModel.data('editor-last-state'));
            this.scriptModel.parse();
            // TODO: needed?
            // if (active) {
            //     plugin.activate();
            // }
        },
        
        _toggleAutoSave: function() {
            if (this.editorModel.isSyncEnabled) {
                var controller = this.editorController;
                $.prompt('This will turn auto-reload off. Do you wish to continue?', {
                    buttons: {'Yes': true, 'No': 'false'},
                    submit: function(e, v) {
                        if (v) {
                            controller.toggleAutoSave();
                        }
                    }
                });
            }
            else {
                this.editorController.toggleAutoSave();
            }
        },
        
        _editorContentChanged: function() {
            this.editorModel.pendingChanges = this.scriptModel.script() !== this.view.getEditorContent();
            this.scriptModel.script(this.view.getEditorContent());
        },
        
        _enableSync: function() {
            this.scriptModel.data('editor-last-state', this.scriptModel.script());
            
            var self = this;
            $.prompt("You can start writing in your editor. Content will be synchronized with ’afterwriting! PDF preview, facts and stats will be automatically updated.", {
                buttons: {'OK': true, 'Cancel': false},
                submit: function(e, v) {
                    if (v) {
                        self.editorController.toggleSync();
                    }
                }
            });
        },
        
        _disableSync: function() {
            this.editorController.toggleSync();
            
            var self = this;
            $.prompt('Synchronization turned off.', {
                buttons: {'Keep content': true, 'Load version before sync': false},
                submit: function(e, v) {
                    if (!v) {
                        self._restore();
                    }
                }
            });
        }
        
    });

    return EditorViewPresenter;
});