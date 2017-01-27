define('modules/data', function (require) {

	var Modernizr = require('modernizr'),
		fparser = require('aw-parser').parser,
		fliner = require('utils/fountain/liner'),
		converter = require('utils/converters/scriptconverter'),
		preprocessor = require('utils/fountain/preprocessor'),
		decorator = require('utils/decorator');

	var plugin = {};
	var _tempStorage = {};
	var url_params = {};

	if (window && window.location && window.location.search) {
		window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
			url_params[key] = value;
		});
	}

	plugin.data = function (key, value) {
		if (Modernizr.localstorage) {
			if (arguments.length === 1) {
				return window.localStorage.getItem('com.afterwriting.labs.local-storage.' + key);
			} else {
				window.localStorage.setItem('com.afterwriting.labs.local-storage.' + key, value);
			}
		} else {
			if (arguments.length === 1) {
				return _tempStorage[key];
			} else {
				_tempStorage[key] = value;
			}
		}
	};

	plugin.format = '';

	plugin.script = decorator.property(function (value) {
		var result = converter.to_fountain(value);
		result.value = preprocessor.process_snippets(result.value, plugin.config.snippets);
		plugin.format = plugin.format || result.format;
		return result.value;
	});

	plugin.parse = decorator(function () {
		plugin.parsed = fparser.parse(plugin.script(), plugin.config);
		plugin.parsed.lines = fliner.line(plugin.parsed.tokens, plugin.config);

		if (plugin.config.use_print_settings_for_stats) {
			plugin.parsed_stats = plugin.parsed;
		} else {
			var stats_config = Object.create(plugin.config);
			stats_config.print_actions = true;
			stats_config.print_headers = true;
			stats_config.print_dialogues = true;
			stats_config.print_sections = false;
			stats_config.print_notes = false;
			stats_config.print_synopsis = false;
			plugin.parsed_stats = fparser.parse(plugin.script(), stats_config);
			plugin.parsed_stats.lines = fliner.line(plugin.parsed_stats.tokens, stats_config);
		}
	});
    
    /**
     * TODO: replace with Protoplast bindings after converting to a model
     * @param callback
     */
    plugin.bindScript = function(callback) {
        plugin.script.add(function(){
            callback();
        });
        if (plugin.script()) {
            callback();
        }
    };

	return plugin;

});