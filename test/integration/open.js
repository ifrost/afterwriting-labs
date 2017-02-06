define(function (require) {

    var Protoplast = require('protoplast'),
        mock = require('../proto-mock'),

        SettingsController = require('plugin/settings/controller/settings-controller'),
        MockThemeController = mock(require('aw-bubble/controller/theme-controller')),

        OpenController = require('plugin/io/controller/open-controller'),
        IoModel = require('plugin/io/model/io-model'),
        MockStorage = mock(require('core/model/storage')),
        MockEditorController = mock(require('plugin/editor/controller/editor-controller')),
        MockSaveController = mock(require('plugin/io/controller/save-controller')),

        SettingsLoaderModel = require('plugin/settings/model/settings-loader-model'),
        Settings = require('core/model/settings'),
        ScriptModel = require('core/model/script-model');
    
    describe('Open', function () {

        var context,
            mockStorage,
            ioModel,
            scriptModel;

        beforeEach(function() {

            mockStorage = MockStorage.create();

            mockStorage.getItem.withArgs('last-used-date').returns('2017-01-01 00:00');
            mockStorage.getItem.withArgs('last-used-title').returns('Title');
            mockStorage.getItem.withArgs('last-used-script').returns('Script');

            context = Protoplast.Context.create();

            context.register('script', scriptModel = ScriptModel.create());
            context.register('settings', Settings.create());
            context.register('storage', mockStorage);

            context.register(SettingsController.create());
            context.register(MockThemeController.create());
            context.register('settingsLoaderModel', SettingsLoaderModel.create());

            context.register(OpenController.create());
            context.register(ioModel = IoModel.create());
            context.register(MockEditorController.create());
            context.register(MockSaveController.create());
        });

        it('Loads last used info', function() {
            context.build();

            chai.assert.strictEqual(ioModel.lastUsedInfo.title, 'Title');
            chai.assert.strictEqual(ioModel.lastUsedInfo.script, 'Script');
            chai.assert.strictEqual(ioModel.lastUsedInfo.date, '2017-01-01 00:00');
        });

        it('Sets the script to last used if set in settings', function() {
            mockStorage.getItem.withArgs('settings').returns({load_last_opened: true});
            context.build();

            chai.assert.strictEqual(scriptModel.script, 'Script');
        });

        it('Does not set the script to last used if not set in settings', function() {
            mockStorage.getItem.withArgs('settings').returns({load_last_opened: false});
            context.build();

            chai.assert.isUndefined(scriptModel.script);
        });

    });

});