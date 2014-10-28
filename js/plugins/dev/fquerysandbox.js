/* global define */
define(function (require) {
	var pm = require('utils/pluginmanager'),
		fhelpers = require('utils/fountain/helpers'),
		data = require('modules/data'),
		fquery = require('utils/fountain/query'),
		helper = require('utils/helper');

	var plugin = pm.create_plugin('dev/fquerysandbox', 'fquery');
	
	plugin.activate = function() {
		window.data = data;
		window.fquery = fquery;
		window.fhelpers = fhelpers;
		window.helper = helper;
	}
	
	return plugin;
});