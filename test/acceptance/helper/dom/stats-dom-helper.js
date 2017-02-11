define(function(require) {

    var BaseDomHelper = require('acceptance/helper/dom/base-dom-helper');

    var StatsDomHelper = BaseDomHelper.extend({

        /**
         * A page on a list of pages in stats page balance
         */
        $page_balance_page: '#stats-page-balance svg'

    });

    return StatsDomHelper;
});