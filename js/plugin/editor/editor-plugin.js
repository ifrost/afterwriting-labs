define(function(require) {

    var data = require('modules/data'),
        Plugin = require('core/plugin'),
        EditorSection = require('plugin/editor/model/editor-section'),
        EditorController = require('plugin/editor/controller/editor-controller'),
        EditorModel = require('plugin/editor/model/editor-model'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var InfoPlugin = Plugin.extend({

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

            data.bindScript(function(){
                editorSection.isVisibleInMenu = true;
            });
        }

    });

    return InfoPlugin;
});