define(function (require) {
	var Section = require('aw-bubble/model/section'),
        SettingsView = require('templates/plugins/settings-view'), 
        pm = require('utils/pluginmanager'),
		data = require('modules/data');
		// open = require('plugins/open');

    var section = Section.create('settings');
    section.title = 'Settings';
    section.shortTitle = 'setup';
    section.isVisibleInMenu = false;
    section.description = 'You can change configuration here. Some settings (e.g. page size, double space between scenes) may affect statistics which are based on assumption that 1 page = 1 minute of a movie.';
    section.smallIcon = 'gfx/icons/settings.svg';
    section.mainContent = SettingsView.create();

    data.script.add(function(){
        section.isVisibleInMenu = true;
    });

    var plugin = pm.create_plugin(null, null, null, section);

    var updateConfig = function() {
        plugin.theme.themeController.showBackgroundImage(data.config.show_background_image);
        plugin.theme.themeController.nightMode(data.config.night_mode);
    };

    data.save_config.add(updateConfig);

	plugin.get_config = function () {
		return data.config;
	};

	plugin.save = function () {
		data.save_config();
		data.script(data.script());
	};

	plugin.get_default_config = function () {
		return data.default_config;
	};

	plugin.windup = function () {
		if (data.config.load_last_opened) {
			// TODO: remove dependency
            //open.open_last_used(true);
		}
        updateConfig();
	};

	return plugin;
});