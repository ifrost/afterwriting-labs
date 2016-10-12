define(function(require) {

    var Protoplast = require('aw-bubble/vendor/protoplast');

    var ThemeModel = Protoplast.Model.extend({
        
        sections: null,
        
        sectionsMenu: null,

        _allSections: null,

        sectionsMap: null,
        
        initAnimationDelay: 800,
        
        width: null,
        
        height: null,
        
        footer: '',

        expanded: false,
        
        showBackgroundImage: true,
        
        backgroundImageVisible: {
            computed: ['showBackgroundImage', 'small'],
            value: function() {
                return this.showBackgroundImage && !this.small
            }
        },
        
        small: {
            computed: ['width'],
            value: function() {
                return this.width < 800; 
            }
        },
        
        $create: function() {
            this._allSections = Protoplast.Collection.create();
            this.sections = Protoplast.CollectionView.create(this._allSections);
            this.sectionsMenu = Protoplast.CollectionView.create(this._allSections);
            this.sectionsMenu.addFilter({
                properties: ['isVisibleInMenu'],
                fn: function(section) {
                    return section.isVisibleInMenu;
                }
            });
            this.sectionsMap = {};
        },
        
        addSection: function(name, section) {
            this.sectionsMap[name] = section;
            this._allSections.add(section);
        },
        
        getSection: function(name) {
            return this.sectionsMap[name];
        }
        
    });

    return ThemeModel;
});