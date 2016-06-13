require(['bootstrap',
    'modules/data',
    'modules/test',
    'modules/queries',
    'plugins/layout',
    'plugins/open',
    'plugins/settings',
    'plugins/dev/test',
    'plugins/dev/fquerysandbox'
], function(bootstrap) {
    bootstrap.init(Array.prototype.splice.call(arguments, 1));
});