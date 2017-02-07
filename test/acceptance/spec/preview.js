define(function (require) {

    var Env = require('acceptance/helper/env');
    
    describe('Preview', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('GIVEN JavaScript PDF Viewer is enabled WHEN preview plugin is selected THEN JavaScript preview is loaded', function() {

        });

        it('GIVEN JavaScript PDF Viewer is disabled WHEN preview plugin is selected THEN Embedded preview is loaded', function() {

        });

        it.skip('WHEN save pdf locally is clicked THEN save pdf dialog is displayed', function() {

        });

        it.skip('WHEN save pdf to Dropbox button is clicked THEN save pdf to Dropbox dialog is displayed', function() {

        });

        it.skip('WHEN save pdf to GoogleDrive button is clicked THEN save pdf to GoogleDrive dialog is displayed', function() {

        });


    });

});