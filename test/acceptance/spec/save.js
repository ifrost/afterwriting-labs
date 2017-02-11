define(function(require) {

    var Env = require('acceptance/helper/env');

    describe.only('Save plugin', function() {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('WHEN save fountain locally is clicked THEN filename dialog is displayed AND default file name is screenplay.fountain', function() {
            // WHEN
            env.user.save_fountain_locally('save');

            // THEN
            env.assert.dialog_is_visible(true);
            env.assert.dialog_message_is('Select file name:');
            env.assert.input_content_is('screenplay.fountain');
        });

        it('WHEN save pdf locally is clicked THEN filename dialog is displayed AND default filr name is screenplay.pdf', function() {
            // WHEN
            env.user.save_pdf_locally('save');

            // THEN
            env.assert.dialog_is_visible(true);
            env.assert.dialog_message_is('Select file name:');
            env.assert.input_content_is('screenplay.pdf');
        });

        it.skip('WHEN save fountain to Dropbox is clicked THEN Dropbox save fountain dialog is displayed AND pdf files are not listed', function() {
            // WHEN
            env.user.save_fountain_dropbox('save');

            // THEN

        });

        it.skip('WHEN save pdf to Dropbox is clicked THEN Dropbox save PDF dialog is displayed AND only pdf files are listed', function() {
            // WHEN
            env.user.save_pdf_dropbox('save');

            // THEN

        });

        it.skip('WHEN save fountain to GoogleDrive is clicked THEN Dropbox save fountain dialog is displayed AND pdf files are not listed', function() {
            // WHEN
            env.user.save_fountain_google_drive('save');

            // THEN

        });

        it.skip('WHEN save pdf to GoogleDrive is clicked THEN Dropbox save PDF dialog is displayed AND only pdf files are listed', function() {
            // WHEN
            env.user.save_pdf_google_drive('save');

            // THEN

        });

        it.skip('WHEN save dialog is displayed THEN search bar is not visible', function() {
            // WHEN
            env.user.save_fountain_dropbox('save');

            // THEN
            
        });

        it.skip('GIVEN Dropbox is not available THEN Dropbox links are not visible', function() {
            // GIVEN
            env.dropbox.disable();

            env.dropbox.enable();
        });

        it.skip('GIVEN GoogleDrive is not available THEN GoogleDrive links are not visible', function() {
            // GIVEN
            env.google_drive.disable();

            env.google_drive.enable();
        });

    });

});