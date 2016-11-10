define(function(require) {

    var Protoplast = require('p'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        ThemeModel = require('aw-bubble/model/theme-model');

    var TopMenuPresenter = Protoplast.Model.extend({
        
        sections: null,

        themeModel: {
            inject: ThemeModel
        },

        themeController: {
            inject: ThemeController
        },

        small: {
            get: function() {
                return this.themeModel.small
            }
        },

        init: {
            injectInit: true,
            value: function() {
                Protoplast.utils.bind(this, 'themeModel.sectionsMenu', this.updateSections.bind(this));
                Protoplast.utils.bind(this, 'themeModel.sections.selected', this.updateSelectedSection.bind(this));

                this.view.on('close', this.closeCurrentContent.bind(this));
                this.view.on('expand', this.toggleExpanded.bind(this));
            }
        },

        updateSections: function() {
            if (this.themeModel.sections.length) {
                this.view.sections = this.themeModel.sectionsMenu;
            }
        },
        
        updateSelectedSection: function() {
            this.view.setSelected(this.themeModel.sections.selected);
        },

        closeCurrentContent: function() {
            this.themeController.clearSelectedSection();
        },

        toggleExpanded: function() {
            this.themeController.toggleExpanded();
        },

        $create: function() {
            this.sections = Protoplast.Collection.create();
        }

    });

    return TopMenuPresenter;
});