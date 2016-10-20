define(function(require) {

    var Protoplast = require('p'),
        Main = require('aw-bubble/view/main'),
        ThemeModel = require('aw-bubble/model/theme-model'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var BubbleTheme = Protoplast.Object.extend({

        context: null,

        settingsModel: null,

        rootElement: null,

        $create: function(rootElement) {
            this.rootElement = rootElement || document.body;
            this.context = Protoplast.Context.create();

            this.themeModel = ThemeModel.create();
            this.themeController = ThemeController.create();
            
            this.context.register('theme-model', this.themeModel);
            this.context.register('theme-controller', this.themeController);

            this.context.build();

            this.main = Main.create();

            this.rootElement.innerHTML = '';
            this.context.register(this.main);

            this.root = Protoplast.Component.Root(this.rootElement);
        },

        start: function() {
            this.root.add(this.main);
            this.context._objects.pub('bubble-theme/init');
        }

    });

    return BubbleTheme;
});