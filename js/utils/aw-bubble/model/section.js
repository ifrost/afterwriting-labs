define(function(require) {

    var Protoplast = require('protoplast');

    /**
     * Represents a section/page on the site
     */
    var Section = Protoplast.Model.extend({

        // DEBT: unify id and name (at the moment id is used for tracking)
        id: null,
        
        bigIcon: null,
        
        smallIcon: null,

        /**
         * If true, will be active only if the script is loaded
         */
        needsScript: false,

        /**
         * Main content plugin
         */
        mainContent: null,
        
        tools: null,
        
        name: null,
        
        title: null,
        
        shortTitle: null,
        
        description: null,
        
        isVisibleInMenu: true,
        
        isActive: undefined,
        
        isFullyVisible: false,
        
        $create: function(name) {
            this.name = name;
        }
        
    });

    return Section;
});