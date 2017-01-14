define(function(require) {

    var Protoplast = require('p'),
        // DEBT: data should be parsed when needed, by using computed properties and bindings (+)
        data = require('modules/data');

    /**
     * @alias BaseSectionPresenter
     */
    var BaseSectionPresenter = Protoplast.Object.extend({

        /**
         * @type {SectionViewMixin}
         */
        view: null,
        
        _bindingsInitialised: false,
        
        init: function() {
            var section = this.view.section;
            Protoplast.utils.bind(section, 'isActive', this._isActiveChanged)
        },
        
        _isActiveChanged: function(value) {
            // DEBT: binding should allow ignoring undefined values? (+)
            if (this._bindingsInitialised) {
                if (value) {
                    data.parse();
                    this.activate();
                }
                else {
                    this.deactivate();
                }
            }
            else {
                this._bindingsInitialised = true;
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