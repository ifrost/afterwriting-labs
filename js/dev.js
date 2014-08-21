define(['core', 'plugins/open', 'utils/layout'], function (core, open, layout, dev_plugin) {
	if (window.__devmode) {
		core.loaded = function () {

			if (dev_plugin) {
				open.open_sample('big_fish');

				core.switch_to(dev_plugin);

				layout.show_options();
				layout.open_content();
				layout.switch_to_plugin(dev_plugin.name);
			}

			layout.dev();
		}

		window.core = core;
	}
});