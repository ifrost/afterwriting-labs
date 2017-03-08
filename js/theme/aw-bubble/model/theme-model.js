define(function(require) {

    var Protoplast = require('protoplast'),
        TooltipModel = require('theme/aw-bubble/model/tooltip');

    var ThemeModel = Protoplast.Model.extend({
        
        sections: null,
        
        sectionsMenu: null,

        _allSections: null,

        sectionsMap: null,
        
        animationDelay: 800,
        
        contentSlideAnimation: 500,
        
        width: undefined,
        
        height: undefined,
        
        footer: '',

        expanded: false,
        
        nightMode: false,
        
        showBackgroundImage: true,
        
        tooltip: null,
        
        backgroundImageVisible: {
            computed: ['showBackgroundImage', 'small'],
            value: function() {
                return this.showBackgroundImage && !this.small;
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
            this.tooltip = TooltipModel.create();
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