define(function (require) {

	var finaldraft_converter = require('utils/converters/finaldraft'),
		$ = require('jquery');

	/**
	 * Tool recognizes the object format and tries to convert it to fountain
	 */
	var module = {};

	module.to_fountain = function (value) {
		var format = 'fountain';
		if (/<\?xml/.test(value)) {
			value = finaldraft_converter.to_fountain(value);
			format = 'fdx';
		} else if ($.isXMLDoc(value)) {
			value = finaldraft_converter.to_fountain(new XMLSerializer().serializeToString(value));
			format = 'fdx';
		}
		return {
			value: value,
			format: format
		};

	};
	
	return module;
});