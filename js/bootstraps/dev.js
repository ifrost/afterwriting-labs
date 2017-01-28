require(['bootstrap',
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