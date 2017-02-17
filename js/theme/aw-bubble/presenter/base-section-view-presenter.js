define(function(require) {

    var Protoplast = require('protoplast');
    
    /**
     * @alias BaseSectionPresenter
     */
    var BaseSectionPresenter = Protoplast.Object.extend({

        // TODO: data should be parsed when needed, by using computed properties and bindings (++)
        scriptModel: {
            inject: 'script'
        },
        
        /**
         * @type {SectionViewMixin}
         */
        view: null,
        
        init: function() {
            var section = this.view.section;
            Protoplast.utils.bind(section, 'isActive', this._isActiveChanged)
        },
        
        _isActiveChanged: function(value) {
            if (value) {
                this.scriptModel.parse();
                this.activate();
            }
            else {
                this.deactivate();
            }
        },
        
        activate: function() {
            this.view.show();
        },
        
        deactivate: function() {
            this.view.hide();
        }
        
    });

    return BaseSectionPresenter;
});