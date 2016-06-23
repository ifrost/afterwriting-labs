define(function(require) {

    var open = require('plugins/open'),
        data = require('modules/data'),
        editor = require('plugins/editor'),
        layout = require('plugins/layout'),
        db = require('utils/dropbox'),
        cm = require('libs/codemirror/lib/codemirror'),
        tree = require('utils/tree'),
        save = require('utils/save');

    describe('Cloud sync', function() {

        var clock, cm_editor;

        beforeEach(function() {
            clock = sinon.useFakeTimers();
            editor.data_model = data;
            save.data = data;
            open.data = data;
            open.editor = editor;
            open.layout = layout;

            cm_editor = {
                on: function(event, callback) {
                    this.change_callback = callback;
                },
                getValue: sinon.stub().returns('content'),
                setSize: sinon.stub(),
                refresh: sinon.stub()
            };
            sinon.stub(cm, 'fromTextArea').returns(cm_editor);

            sinon.stub(db, 'load_file', function(path, callback) {
                callback('test content');
            });
            sinon.stub(db, 'list', function(callback) {
                callback({});
            });
            sinon.stub(save, 'save_current_script', function(callback) {
                if (callback) {
                    callback();
                }
            });
            sinon.stub(db, 'convert_to_jstree');
            sinon.stub(tree, 'show', function(opts) {
                opts.callback({
                    data: {
                        isFolder: false
                    }
                })
            });
            data.prepare();
        });

        afterEach(function() {
            clock.restore();
            save.save_current_script.restore();
            db.load_file.restore();
            db.list.restore();
            db.convert_to_jstree.restore();
            tree.show.restore();
        });

        it('Auto-saves when content changes', function() {
            open.open_from_dropbox();
            sinon.assert.calledOnce(db.load_file);

            editor.create_editor();

            editor.toggle_auto_save();
            sinon.assert.calledOnce(save.save_current_script);

            cm_editor.change_callback();

            clock.tick(5000);
            sinon.assert.calledOnce(db.load_file);
            sinon.assert.calledTwice(save.save_current_script);
        });

    });

});