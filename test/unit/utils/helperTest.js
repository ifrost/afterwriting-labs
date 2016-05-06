define(['utils/helper'],function (helper) {
	
	describe('Time Helper', function () {

		it('formats time', function () {
			chai.assert.equal(helper.format_time(1.1), '01:06');
		});

	});

});