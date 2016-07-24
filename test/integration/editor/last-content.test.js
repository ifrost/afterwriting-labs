define(function(require) {

    var open = require('plugins/open'),
        data = require('modules/data'),
        save = require('plugins/save'),
        editor = require('plugins/editor'),
        layout = require('plugins/layout');

    describe('Last content', function() {

        beforeEach(function() {

            open.data = data;
            open.save = save;
            open.editor = editor;
            open.layout = layout;

            data.prepare();
            open.prepare();
        });

        afterEach(function() {

        });

        it('Sets last used content when loading open plugin', function() {

            data.script('Title: Test');
            open.prepare();
            chai.assert.equal(open.last_used.title, 'Test');
            chai.assert.isNotNull(open.last_used.date);

        });

    });

});