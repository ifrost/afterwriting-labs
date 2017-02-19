define(function (require) {

    var Protoplast = require('protoplast'),
        mock = require('test/proto-mock'),

        OpenController = require('plugin/io/controller/open-controller'),
        ScriptModel = require('core/model/script-model'),
        MockIoModel = mock(require('plugin/io/model/io-model')),
        MockStorage = mock(require('core/model/storage')),
        MockEditorController = mock(require('plugin/editor/controller/editor-controller')),
        MockSaveController = mock(require('plugin/io/controller/save-controller')),

        SettingsController = require('plugin/settings/controller/settings-controller'),
        Settings = require('core/model/settings'),
        SettingsLoaderModel = require('plugin/settings/model/settings-loader-model'),
        MockThemeController = mock(require('theme/aw-bubble/controller/theme-controller'));

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
            context.register(ioModel = MockIoModel.create());
            context.register(MockEditorController.create());
            context.register(MockSaveController.create());
        });
        
        it('GIVEN loading last content is enabled WHEN app loads THEN last used content is loaded', function() {
            // GIVEN
            mockStorage.getItem.withArgs('settings').returns({load_last_opened: true});

            // WHEN
            context.build();

            // THEN
            chai.assert.strictEqual(scriptModel.script, 'Script');
        });

        it('GIVEN loading last content is disabled WHEN app loads THEN last used content is notloaded', function() {
            // GIVEN
            mockStorage.getItem.withArgs('settings').returns({load_last_opened: false});

            // WHEN
            context.build();

            // THEN
            chai.assert.isUndefined(scriptModel.script);
        });

        it.skip('WHEN last content is opened on startup THEN feature/open-last-used/startup event is track', function() {
            // TODO: Create a separate integration test // env.assert.monitor.event_tracked('feature', 'open-last-used', 'startup');  (+)
        });

        it.skip('WHEN a file is loaded from GoogleDrive THEN feautre/open-google-drive event is tracked AND format is passed', function() {
            // env.user.open.open_from_googledrive();
            ///env.assert.monitor.event_tracked('feature', 'open-googledrive', 'format');
        });


    });

});