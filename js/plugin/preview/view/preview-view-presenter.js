define(function(require) {

        var BaseSectionViewPresenter = require('aw-bubble/presenter/base-section-view-presenter'),
        editor = require('plugins/editor'),
        pdfmaker = require('utils/pdfmaker');

    var PreviewViewPresenter = BaseSectionViewPresenter.extend({

        activate: function() {
            BaseSectionViewPresenter.activate.call(this);
            editor.synced.add(this.refresh);
        },

        deactivate: function() {
            BaseSectionViewPresenter.deactivate.call(this);
            editor.synced.remove(this.refresh);
        },

        refresh: function() {
            setTimeout(function() {
                pdfmaker.get_pdf(function(result) {
                    this.view.pdf = result;
                }.bind(this));
            }.bind(this), 0);
        }

    });

    return PreviewViewPresenter;
});