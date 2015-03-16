define(['utils/converters/finaldraft',
	    '../../../../test/screenplays'], function (converter, screenplays) {

	function get_scripts(name) {
		return {
			fdx: screenplays['test/screenplays/fdx/' + name + '.fdx'](),
			fountain: screenplays['test/screenplays/fdx/' + name + '.fountain']()
		};
	}

	describe('FinalDraft Converter', function () {

		it('converts notes saved in paragraph to inline notes', function () {
			var scripts = get_scripts('note');

			var fountain = converter.to_fountain(scripts.fdx);

			chai.assert.equal(fountain, scripts.fountain);
		});

		it('converts synopsis', function () {
			var scripts = get_scripts('synopsis');

			var fountain = converter.to_fountain(scripts.fdx);

			chai.assert.equal(fountain, scripts.fountain);
		});

		it('coverts header notes', function () {
			var scripts = get_scripts('header_note');

			var fountain = converter.to_fountain(scripts.fdx);

			chai.assert.equal(fountain, scripts.fountain);
		});

	});

});