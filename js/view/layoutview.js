define(function(require){

    var $ = require('jquery'),
        TemplateView = require('view/templateview'),
        template = require('text!../../html/template/layout.html');

    var InfoView = TemplateView.extend({

        template: template,

        init: function() {
            TemplateView.init.call(this);
        }
    });

    return InfoView;
});