require(['bootstrap',
		'modules/data',
		'modules/test',
		'modules/queries',
		'plugins/open',		 
		'plugins/settings',
		'plugins/dev/test',
		'plugins/dev/fquerysandbox'
], function (bootstrap) {
	bootstrap.init(arguments);
});