require(['bootstrap',
    'modules/monitor',
    'modules/data',
    'modules/queries',
    'modules/charts',
    'modules/dev',
    'plugins/layout',
    'plugins/info',
    'plugins/open',
    'plugins/settings',
    'plugins/editor',
    'plugins/save',
    'plugins/preview',
    'plugins/facts',
    'plugins/stats',
    '../test/acceptance/setup'
], function(bootstrap) {
    bootstrap.init(Array.prototype.splice.call(arguments, 1));
});