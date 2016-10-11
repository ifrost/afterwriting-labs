define(function(require) {

    var $ = require('aw-bubble/vendor/jquery'),
        Protoplast = require('aw-bubble/vendor/protoplast');

    var SectionContainer = Protoplast.Component.extend({

        html: '<div style="overflow: hidden; position: relative">' +
        '<h1 style="float: left; border-bottom: 1px dashed lightgray"><span data-prop="title"></span>&nbsp;<span data-prop="infoIcon" class="info-icon"/></h1>' +
        '<div data-comp="toolsParent"></div>' +
        '<p data-prop="description" class="info-content" style="display: none; clear: both"></p>' +
        '<div data-comp="contentParent"></div>' +
        '</div>',

        contentParent: {
            component: Protoplast.Component.extend({html:'<div style="width:95%; clear: both; overflow: auto"></div>'})
        },

        toolsParent: {
            component: Protoplast.Component.extend({html:'<div style="float: right; margin-right: 35px"><span></span></div>'})
        },

        themeModel: {
            inject: 'theme-model'
        },

        title: null,

        description: null,

        infoIcon: null,

        section: null,

        descriptionVisible: false,

        bottomPadding: 60,

        visible: {
            set: function(value) {
                this._visible = value;
                this.root.style.display = value ? 'block' : 'none'
            },
            get: function() {
                return this._visible;
            }
        },

        $create: function() {
            this.$root = $(this.root);
            this.$description = $(this.description);

            this.infoIcon.onclick = function() {
                this.descriptionVisible = !this.descriptionVisible;
            }.bind(this)
        },

        init: function() {
            Protoplast.utils.bind(this, 'section.mainContent', this.recreateContent.bind(this));
            Protoplast.utils.bind(this, 'section.title', this.updateTitle.bind(this));
            Protoplast.utils.bind(this, 'section.tools', this.updateTools.bind(this));
            Protoplast.utils.bind(this, 'section.description', this.updateDescription.bind(this));
            Protoplast.utils.bind(this, 'descriptionVisible', this.toggleDescription.bind(this));
            Protoplast.utils.bind(this, 'themeModel.height', this.updateHeight.bind(this));
            Protoplast.utils.bind(this, 'bottomPadding', this.updateHeight.bind(this));
            Protoplast.utils.bind(this, 'section.isFullyVisible', this.updateHeight.bind(this));
        },

        updateTools: function() {
            if (this.section.tools) {
                this.toolsParent.add(this.section.tools);
            }
        },

        updateHeight: function() {
            this.$root.height((this.themeModel.height - this.bottomPadding) + 'px');
            this.contentParent.root.style.height = ($(this.root).height() - $(this.contentParent.root).position().top) + 'px';
        },
        
        fadeIn: function(callback) {
            this.$root.fadeIn(250, callback);
        },
        
        fadeOut: function(callback) {
            this.$root.fadeOut(250, callback);
        },

        toggleDescription: function() {
            if (this.descriptionVisible) {
                this.$description.show({
                    duration: 200,
                    easing: 'linear'
                });
            }
            else {
                this.$description.hide({
                    duration: 200,
                    easing: 'linear'
                });
            }
        },

        recreateContent: function() {
            if (this.section.mainContent) {
                this.$root.attr('plugin', this.section.name);
                this.$root.addClass('plugin-content', this.section.name);
                this.contentParent.add(this.section.mainContent);
                this.updateHeight();
            }
        },

        updateTitle: function() {
            this.title.innerHTML = this.section.title;
        },

        updateDescription: function() {

            if (!this.section.description) {
                this.description.style.display = 'none';
                this.infoIcon.style.display = 'none';
            }
            else {
                this.description.style.display = this.descriptionVisible ? 'block' : 'none';
                this.infoIcon.style.display = 'inline';
            }

            this.description.innerHTML = this.section.description;
        }

    });

    return SectionContainer;
});