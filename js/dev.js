define(['core', 'utils/common', 'plugins/open', 'utils/layout'], function (core, common, open, layout, dev_plugin) {
	var module = {};

	module.pre_init = function() {
		common.data.static_path = '';	
	};
	
	module.init = function () {
		if (dev_plugin) {
			open.open_sample('big_fish');

			setTimeout(function () {
				core.switch_to(dev_plugin);

				layout.show_options();
				layout.open_content();
				layout.switch_to_plugin(dev_plugin.name);
			}, 0);
			
		}
		layout.dev();
		window.core = core;
	};

	return module;
});