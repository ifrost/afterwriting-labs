define(function(require) {

    var Protoplast = require('p');

    /**
     * @alias LastUsedInfo
     */
    var LastUsedInfo = Protoplast.Model.extend({

        /**
         * @type {String}
         */
        script: null,

        /**
         * @type {Date}
         */
        date: null,

        /**
         * @type {String}
         */
        title: null
    });

    return LastUsedInfo;
});