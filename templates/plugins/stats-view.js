define(function(require) {

    var template = require('text!templates/plugins/stats.hbs'),
        $ = require('jquery'),
        layout = require('utils/layout'),
        helper = require('utils/helper'),
        charts = require('modules/charts'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            var stats = this.plugin;
            
            var render = function() {
                charts.spider_chart.render('#who-with-who', stats.data.who_with_who.characters, stats.data.who_with_who.links, {
                    label: 'name'
                });

                charts.bar_chart.render('#stats-scene-length', stats.data.scenes, {
                    tooltip: function(d) {
                        return d.header + ' (time: ' + helper.format_time(helper.lines_to_minutes(d.length)) + ')'
                    },
                    value: 'length',
                    color: function(d) {
                        if ($('#stats-scene-length-type').val() === "int_ext") {
                            if (d.location_type === 'mixed') {
                                return '#777777';
                            } else if (d.location_type === 'int') {
                                return '#eeeeee';
                            } else if (d.location_type === 'ext') {
                                return '#111111';
                            } else if (d.location_type === 'other') {
                                return '#444444';
                            }
                        }

                        if (d.type == 'day') {
                            return '#eeeeee';
                        } else if (d.type == 'night') {
                            return '#222222';
                        } else {
                            return '#777777';
                        }
                    },
                    bar_click: function(d) {
                        if (!layout.small) {
                            stats.goto(d.token.line);
                        }
                    }
                });

                charts.pie_chart.render('#stats-days-and-nights', stats.data.days_and_nights, {
                    tooltip: function(d) {
                        return d.data.label + ': ' + d.data.value + (d.data.value == 1 ? ' scene' : ' scenes')
                    },
                    value: 'value',
                    color: function(d) {
                        if (d.data.label == 'DAY') {
                            return '#eeeeee';
                        } else if (d.data.label == 'NIGHT') {
                            return '#222222';
                        } else if (d.data.label == 'DAWN') {
                            return '#777777';
                        } else if (d.data.label == 'DUSK') {
                            return '#444444';
                        } else {
                            return '#aaaaaa';
                        }
                    }
                });

                var int_ext_labels = {
                    int: 'INT.',
                    ext: 'EXT.',
                    mixed: 'INT./EXT.',
                    other: 'OTHER'
                };

                charts.pie_chart.render('#stats-int-ext', stats.data.int_and_ext, {
                    tooltip: function(d) {
                        return int_ext_labels[d.data.label] + ': ' + d.data.value + (d.data.value == 1 ? ' scene' : ' scenes')
                    },
                    value: 'value',
                    color: function(d) {
                        if (d.data.label == 'mixed') {
                            return '#777777';
                        } else if (d.data.label == 'int') {
                            return '#eeeeee';
                        } else if (d.data.label == 'ext') {
                            return '#111111';
                        } else if (d.data.label == 'other') {
                            return '#444444';
                        }
                    }
                });

                charts.page_balance_chart.render('#stats-page-balance', stats.data.page_balance, {
                    page_click: function(d) {
                        if (!layout.small) {
                            stats.goto(d.first_line.token.line);
                        }
                    }
                });

                charts.line_chart.render('#stats-tempo', stats.data.tempo, {
                    value: 'tempo',
                    tooltip: function(d, i) {
                        if (i === stats.data.tempo.length - 1) {
                            return '';
                        }
                        return d.scene + '<br />...' + d.line + '... ';
                    },
                    click: function(d) {
                        if (!layout.small) {
                            stats.goto(d.line_no);
                        }
                    }
                });

                charts.locations_breakdown.render('#locations-breakdown', stats.data.locations_breakdown);

            };

            stats.refresh.add(render);
            $('#stats-scene-length-type').on('change', render);

            layout.toggle_expand.add(function() {
                if (stats.is_active) {
                    render();
                }
            });
        }

    });

});
