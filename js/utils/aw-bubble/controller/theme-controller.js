define(function(require) {

    var Protoplast = require('p'),
        ThemeModel = require('aw-bubble/model/theme-model');
    
    var ThemeController = Protoplast.extend({
        
        themeModel: {
            inject: ThemeModel
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
        },
        
        setFooter: function(content) {
            this.themeModel.footer = content;
        },

        showBackgroundImage: function(value) {
            this.themeModel.showBackgroundImage = value;
        },

        nightMode: function(value) {
            this.themeModel.nightMode = value;
        },

        showTooltip: function(text) {
            this.themeModel.tooltip.text = text;
        },

        hideTooltip: function() {
            this.themeModel.tooltip.text = '';
        },

        moveTooltip: function(x, y) {
            this.themeModel.tooltip.x = x;
            this.themeModel.tooltip.y = y;
        }

    });

    return ThemeController;
});