require(['bootstrap',
		'modules/data',
		'modules/queries',
        'modules/charts',
		'modules/dev',
		'plugins/settings',
		'plugins/facts',
		'plugins/stats',
		'../test/acceptance/setup'
], function (bootstrap) {
	bootstrap.init(arguments);
});