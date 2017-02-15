define(function (require) {

    var Env = require('acceptance/env');
    
    describe('Preview', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it.skip('GIVEN JavaScript PDF Viewer is enabled WHEN preview plugin is selected THEN JavaScript preview is loaded', function() {

        });

        it.skip('GIVEN JavaScript PDF Viewer is disabled WHEN preview plugin is selected THEN Embedded preview is loaded', function() {

        });

        it('WHEN save pdf locally is clicked THEN save pdf dialog is displayed', function() {
            // WHEN
            env.user.save.save_pdf_locally('preview');

            // THEN
            env.assert.popup.dialog_form_is_visible(true);
            env.assert.popup.dialog_message_is('Select file name:');
            env.assert.popup.dialog_input_content_is('screenplay.pdf');
        });

        it.skip('WHEN save pdf to Dropbox button is clicked THEN save pdf to Dropbox dialog is displayed', function() {
            // WHEN
            env.user.save.save_pdf_dropbox('preview');

            // THEN

        });

        it.skip('WHEN save pdf to GoogleDrive button is clicked THEN save pdf to GoogleDrive dialog is displayed', function() {
            // WHEN
            env.user.save.save_pdf_google_drive('preview');

            // THEN

        });

        it('GIVEN GoogleDrive is not available THEN save pdf to GoogleDrive is not displayed', function() {
            // GIVEN
            env.google_drive.disable();
            env.user.theme.open_plugin('open');
            env.user.open.open_sample('brick_and_steel');
            env.user.theme.open_plugin('preview');

            // THEN
            env.assert.io.save_button_visible('google_drive', 'preview', 'pdf', false);

            env.google_drive.enable();
        });

        it('GIVEN Dropbox is not available THEN save pdf to Dropbox is not displayed', function() {
            // GIVEN
            env.dropbox.disable();
            env.user.theme.open_plugin('open');
            env.user.open.open_sample('brick_and_steel');
            env.user.theme.open_plugin('preview');

            // THEN
            env.assert.io.save_button_visible('dropbox', 'preview', 'pdf', false);

            env.dropbox.enable();
        });

    });

});