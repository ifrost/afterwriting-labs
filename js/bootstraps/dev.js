require(['bootstrap',
		'modules/data',
		'modules/queries',
        'modules/charts',
		'../test/acceptance/setup'
], function (bootstrap) {
    try {
        bootstrap.init(arguments);
    }
    catch (e) {
        // workaround for missing stack traces in PhantomJS
        console.error('Bootstrap error: ', e.message, e.stack);
        throw e;
    }
});