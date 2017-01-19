define(function(require) {

    var HandlebarComponent = require('utils/handlebar-component'),
        SectionViewMixin = require('aw-bubble/view/section-view-mixin'),
        SettingsPanel = require('plugin/settings/view/settings-panel');

    return HandlebarComponent.extend([SectionViewMixin], {

        hbs: '<div><div data-comp="settingsPanel"/></div>',

        settingsPanel: {
            component: SettingsPanel
        }

    });

});
