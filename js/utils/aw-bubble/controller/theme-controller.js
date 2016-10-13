define(function(require) {

    var Protoplast = require('p'),
        Section = require('aw-bubble/model/section');

    var ThemeController = Protoplast.extend({
        
        themeModel: {
            inject: 'theme-model'
        },
        
        getOrCreateSection: function(name) {
            var section;
            
            if (section = this.themeModel.getSection(name)) {
                return section;
            }
            
            section = Section.create(name);
            this.addSection(section);
            return section;
        },
        
        addSection: function(section) {
            this.themeModel.addSection(section.name, section);
        },

        selectSection: function(selectedSection) {
            this.themeModel.sections.selected = selectedSection;
            this.themeModel.sections.forEach(function(section) {
                section.isActive = section === selectedSection;
            });
        },

        clearSelectedSection: function() {
            this.themeModel.sections.selected = null;
        },
        
        toggleExpanded: function() {
            this.themeModel.expanded = !this.themeModel.expanded;
        },
        
        allSectionsHidden: function() {
            this.themeModel.sections.forEach(function(section) {
                section.isFullyVisible = false;
            });
        },
        
        selectedSectionFullyVisible: function() {
            this.themeModel.sections.selected.isFullyVisible = true;
        }
        
    });

    return ThemeController;
});