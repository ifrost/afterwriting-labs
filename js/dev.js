define(['core', 'plugins/open', 'utils/layout', 'plugins/stats'], function (core, open, layout, dev_plugin) {
	if (window.__devmode) {
		core.loaded = function () {

			if (dev_plugin) {
				open.open_sample('big_fish');

				setTimeout(function() {
					layout.switch_to_plugin(dev_plugin.name);
					core.switch_to(dev_plugin);

					layout.show_options();
					layout.open_content();
				}, 200);
				
			}

			layout.dev();
		}

		window.core = core;
	}
});