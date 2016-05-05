define(function (require) {
	
	var user = require('../helper/user');
	
	describe('App', function () {

        it('Selected plugin is active', function() {
            user.click('.menu-item.info');

            var active = $('.plugin-content.active').attr('plugin');
            chai.assert.strictEqual('info', active);
            
            user.click('#back');
        });

	});

});