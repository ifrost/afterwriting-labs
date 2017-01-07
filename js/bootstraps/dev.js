require(['bootstrap',
		'modules/data',
		'modules/queries',
        'modules/charts',
		'modules/dev',
		'plugins/open',
		'plugins/settings',
		'plugins/save',
		'plugins/facts',
		'plugins/stats',
		'../test/acceptance/setup'
], function (bootstrap) {
	bootstrap.init(arguments);
});