define(function(require) {

    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/dev/fquerysandbox.hbs'),
        fhelpers = require('utils/fountain/helpers'),
        data = require('modules/data'),
        queries = require('modules/queries'),
        fquery = require('utils/fountain/query'),
        helper = require('utils/helper');

    var FQuerySandbox = Plugin.extend({

        name: 'dev/fquerysandbox',

        title: 'fquery',

        template: template,

        activate: function() {
            window.data = data;
            window.fquery = fquery;
            window.fhelpers = fhelpers;
            window.helper = helper;
            window.queries = queries;
        }
    });


    return FQuerySandbox.create();
});