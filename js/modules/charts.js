define(['utils/charts/spider',
		'utils/charts/bar',
		'utils/charts/pie',
		'utils/charts/page_balance',
		'utils/charts/line',
        'utils/charts/locations_breakdown'], function (
            spider_chart, 
			bar_chart, 
			pie_chart, 
			page_balance_chart,
			line_chart,
			locations_breakdown) {

	var module = {};


	module.prepare = function () {
		module.spider_chart = spider_chart;
		module.bar_chart = bar_chart;
		module.pie_chart = pie_chart;
		module.page_balance_chart = page_balance_chart;
		module.line_chart = line_chart;
		module.locations_breakdown = locations_breakdown;
	};

	return module;

});