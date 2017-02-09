define(function (require) {

    var Env = require('acceptance/helper/env');
    
    describe('Save', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it.skip('WHEN save fountain locally is clicked THEN filename dialog is displayed', function() {

        });

        it.skip('WHEN save pdf  locally is clicked THEN filename dialog is displayed', function() {

        });

        it.skip('WHEN save fountain to Dropbox is clicked THEN Dropbox save fountain dialog is displayed AND pdf files are not listed', function() {

        });

        it.skip('WHEN save pdf to Dropbox is clicked THEN Dropbox save PDF dialog is displayed AND only pdf files are listed', function() {

        });
        
        it.skip('WHEN save fountain to GoogleDrive is clicked THEN Dropbox save fountain dialog is displayed AND pdf files are not listed', function() {

        });

        it.skip('WHEN save pdf to GoogleDrive is clicked THEN Dropbox save PDF dialog is displayed AND only pdf files are listed', function() {

        });
        
        it.skip('WHEN save dialog is displayed THEN search bar is not visible', function() {
            
        });

        it.skip('GIVEN Dropbox is not available THEN Dropbox links are not visible', function(){

        });

        it.skip('GIVEN GoogleDrive is not available THEN GoogleDrive links are not visible', function(){

        });

    });

});