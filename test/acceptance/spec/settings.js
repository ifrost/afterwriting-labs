define(function(require) {

   var Env = require('acceptance/helper/env');

   describe('Settings', function() {

      var env;

      beforeEach(function() {
         env = Env.create();
      });

      afterEach(function() {
         env.destroy();
      });

      it('Switches night mode when the checkbox is selected', function() {
         env.user.create_new_script('test');
         env.user.open_plugin('settings');
         env.user.select_night_mode();
         env.assert.night_mode_is_enabled(true);
         env.user.select_night_mode();
         env.assert.night_mode_is_enabled(false);
      });

   });

});