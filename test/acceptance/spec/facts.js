define(function (require) {

    var Env = require('acceptance/env');
    
    describe('Facts', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('GIVEN synchronisation is enabled WHEN facts plugin is selected AND content changes THEN facts are refreshed', function(done) {

            // GIVEN
            env.scenarios.load_dropbox_file({
                name: 'file.fountain',
                content: 'INT. TEST'
            }, function() {
                env.user.theme.open_plugin('editor');
                env.user.editor.turn_sync_on();

                // WHEN
                env.user.theme.open_plugin('facts');
                env.assert.facts.number_of_scenes_is(1);

                // AND
                env.scenarios.dropbox_file_changes('file.fountain', 'INT. TEST\n\nINT. TEST', function() {
                    // THEN
                    env.assert.facts.number_of_scenes_is(2);
                    done();
                });
            });
        });
        
    });

});