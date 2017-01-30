define(function(require) {

    var Protoplast = require('p');

    var SectionContainerPresenter = Protoplast.Object.extend({
        
        pub: {
            inject: 'pub'
        },
        
        init: function() {
            // DEBT: decide about name convention for events (+)
            this.view.on('sectionDescriptionShown', this._publishDescriptionShowEvent);
        },

        _publishDescriptionShowEvent: function(sectionId) {
            this.pub('aw-bubble/section-header/description/shown', sectionId);
        }
        
    });

    return SectionContainerPresenter;
});