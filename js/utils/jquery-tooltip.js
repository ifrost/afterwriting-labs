define(function(require) {
   
    var $ = require('jquery');

    $.fn.tooltip = function() {
        var tooltip = this;
        return {
            show: function(text) {
                tooltip.css("visibility", "visible").html(text);
            },
            hide: function() {
                tooltip.css("visibility", "hidden");
            },
            move: function(x, y) {
                tooltip.css("top", (y - 10) + "px").css("left", (x + 10) + "px");
            }
        }
    };

});