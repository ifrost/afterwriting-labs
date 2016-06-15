define(['core/module',
    'utils/charts/spider',
    'utils/charts/bar',
    'utils/charts/pie',
    'utils/charts/page_balance',
    'utils/charts/line',
    'utils/charts/locations_breakdown'], function(Module,
                                                  spider_chart,
                                                  bar_chart,
                                                  pie_chart,
                                                  page_balance_chart,
                                                  line_chart,
                                                  locations_breakdown) {

    var Charts = Module.extend({

        name: 'charts',

        prepare: function() {
            this.spider_chart = spider_chart;
            this.bar_chart = bar_chart;
            this.pie_chart = pie_chart;
            this.page_balance_chart = page_balance_chart;
            this.line_chart = line_chart;
            this.locations_breakdown = locations_breakdown;
        }

    });

    return Charts.create('charts');
});