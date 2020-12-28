#!/usr/bin/env node

console.info("'afterwriting command line interface");
console.info("www: http://afterwriting.com\n");

global.window = undefined;

require = require('./js/client/awrequire.js');
require.config({
    map: {
        'modernizr': {}
    },
    use_node_require: ['jquery', 'fs', 'd3', 'pdfkit', 'aw-parser', 'protoplast', 'lodash']
});

var Bootstrap = require('bootstrap');
var ClientConfig = require('client/client-config');

ClientConfig.awrequire = require;

Bootstrap.init(ClientConfig);