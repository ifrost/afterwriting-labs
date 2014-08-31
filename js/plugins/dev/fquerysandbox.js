/* global define */
define(function (require) {
	var pm = require('utils/pluginmanager'),
		fhelpers = require('utils/fountain/helpers'),
		data = require('modules/data'),
		fquery = require('utils/fountain/query');

	var plugin = pm.create_plugin('dev/fquerysandbox', 'fquery');
	return plugin;
});