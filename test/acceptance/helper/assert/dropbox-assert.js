define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var DropboxAssert = BaseAssert.extend({

        /**
         * Asserts if saving to Dropbox was invoked given number of timer
         * 
         * @param {Number} count - number of saves
         */
        dropbox_saved: function(count) {
            chai.assert.equal(this.dropbox.saved_count, count, 'content has been saved ' + this.dropbox.saved_count + ', expected: ', count);
        }

    });

    return DropboxAssert;
});