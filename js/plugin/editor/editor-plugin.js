define(function(require) {

    var Plugin = require('core/plugin'),
        EditorSection = require('plugin/editor/model/editor-section'),
        EditorController = require('plugin/editor/controller/editor-controller'),
        EditorModel = require('plugin/editor/model/editor-model'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var EditorPlugin = Plugin.extend({
        
        scriptModel: {
            inject: 'script'
        },
        
        themeController: {
            inject: ThemeController
        },

        $create: function(context) {
            context.register(EditorModel.create());
            context.register(EditorController.create());
        },

        init: function() {
            var editorSection = EditorSection.create('editor');
            this.themeController.addSection(editorSection);

            this.scriptModel.bindScript(function(){
                editorSection.isVisibleInMenu = true;
            });
        }

    });

    return EditorPlugin;
});