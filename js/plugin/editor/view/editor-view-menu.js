define(function(require) {

    var template = require('text!plugin/editor/view/editor-view-menu.hbs'),
        BaseComponent = require('core/view/base-component'),
        EditorViewMenuPresenter = require('plugin/editor/view/editor-view-menu-presenter'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin');

    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: EditorViewMenuPresenter
        },

        hbs: template,

        addInteractions: function() {
            this.onClick('a[action="save-fountain"]', this.dispatch.bind(this, 'save-as-fountain'));
            this.onClick('a[action="save-dropbox-fountain"]', this.dispatch.bind(this, 'dropbox-fountain'));
            this.onClick('a[action="save-gd-fountain"]', this.dispatch.bind(this, 'google-drive-fountain'));
        }
    });
});

