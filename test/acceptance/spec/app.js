define(function (require) {

    var Env = require('acceptance/helper/env');

    describe('Application', function () {

        var env;

        beforeEach(function() {
            env = Env.create();
        });

        afterEach(function() {
            env.destroy();
        });

        it('WHEN page stats is clicked THEN app is switched to editor', function() {
            // GIVEN
            env.user.create_new_script('test');
            env.user.open_plugin('stats');

            // WHEN
            env.user.click_on_page_stats();

            // THEN
            env.assert.active_plugin_is('editor');
        });

        it('WHEN expand button is clicked THEN content spans the whole window', function() {
            // GIVEN
            env.user.open_plugin('info');

            // WHEN
            env.user.click_expand_icon();

            // THEN
            env.assert.content_is_expanded();
        });

        it('GIVEN content is expanded WHEN expand button is clicked THEN content narrows back', function() {
            // GIVEN
            env.user.open_plugin('info');
            env.user.click_expand_icon();

            // WHEN
            env.user.click_expand_icon();

            // THEN
            env.assert.content_is_not_expanded();
        });

        it('WHEN close content is clicked THEN content is hidden', function() {
            // GIVEN
            env.user.open_plugin('info');

            // WHEN
            env.user.close_content();

            // THEN
            env.assert.active_plugin_is(undefined);
        });

        it('WHEN a top menu item is selected THEN selected plugin is displayed', function() {
            // GIVEN
            env.user.open_plugin('info');

            // WHEN
            env.user.open_plugin_from_toolbar('open');

            // THEN
            env.assert.active_plugin_is('open');
        });

        it.only('WHEN a main menu item is selected THEN selected plugin is displayed', function(){
            // WHEN
            env.user.open_plugin('open');

            // THEN
            env.assert.active_plugin_is('open');
        });

        it.skip('WHEN a selected plugin is re-selected from the top menu THEN the same plugin is shown', function() {

        });

        it.skip('GIVEN a plugin is opened WHEN background is clicked THEN content is hidden', function() {
            
        });
        
    });

});