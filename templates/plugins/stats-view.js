define(function(require) {

    var template = require('text!templates/plugins/stats.hbs'),
        $ = require('jquery'),
        layout = require('utils/layout'),
        helper = require('utils/helper'),
        charts = require('modules/charts'),
        Header = require('aw-bubble/view/header'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({

        hbs: template,

        whoWithWhoHeader: {
            component: Header
        },

        scriptPulseHeader: {
            component: Header
        },

        sceneLengthHeader: {
            component: Header
        },
        
        locationsBreakdownHeader:{
            component: Header
        },

        pageBalanceHeader: {
            component: Header
        },

        daysAndNightsHeader: {
            component: Header
        },

        intVsExtHeader: {
            component: Header
        },

        plugin: null,

        init: function() {
            this.whoWithWhoHeader.title = "Who talks with who (by number of scenes)";
            this.whoWithWhoHeader.description = "Each character is represented by a circle (max. 10 characters). If characters are connected with a line that means they are talking in the same scene. Thicker the line - more scenes together. Hover the mouse cursor over a character circle to see how many dialogues scenes that character have with other characters.";

            this.scriptPulseHeader.title = "Script Pulse";
            this.scriptPulseHeader.description = "Short scenes and short action/dialogue blocks bump the tempo up. Long scenes and long blocks set it back.";
            
            this.sceneLengthHeader.title = "Scene length";
            this.sceneLengthHeader.description = "Each bar represent one scene (white bars for day scenes, black bars for night scenes). Hover the mouse cursor over a bar to see estimated time of a scene. You can click on a bar to jump to selected scene in the editor.";
            
            this.locationsBreakdownHeader.title = "Locations breakdown";
            this.locationsBreakdownHeader.description = "Blocks on the top strip represent amount of time spent in a location. If a location occurs more than once in the script, it's highlighted by a colour (white colour is used for each location occurring only once).<br />Pie chart below shows time distribution for each location. Mouse over the blocks to see corresponding data on the pie chart (and vice versa).";
            
            this.pageBalanceHeader.title = "Page balance";
            this.pageBalanceHeader.description = "Shows balance between action time and dialogue time on each page. Click on a page to jump to the editor.";

            this.daysAndNightsHeader.title = "Days and nights";
            this.daysAndNightsHeader.description = "Pie chart representing day vs night scenes breakdown. Hover over sections to see number of day/night scenes.";

            this.intVsExtHeader.title = "INT. vs EXT.";
            this.intVsExtHeader.description = "Pie chart representing interior vs exterior scenes breakdown. Hover over sections to see number of int/ext scenes.";
        },

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
                    small: layout.small,
                    show_tooltip: layout.show_tooltip.bind(layout),
                    hide_tooltip: layout.hide_tooltip.bind(layout),
                    move_tooltip: layout.move_tooltip.bind(layout),
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
                    small: layout.small,
                    show_tooltip: layout.show_tooltip.bind(layout),
                    hide_tooltip: layout.hide_tooltip.bind(layout),
                    move_tooltip: layout.move_tooltip.bind(layout),
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
                    small: layout.small,
                    show_tooltip: layout.show_tooltip.bind(layout),
                    hide_tooltip: layout.hide_tooltip.bind(layout),
                    move_tooltip: layout.move_tooltip.bind(layout),
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
                    },
                    small: layout.small,
                    show_tooltip: layout.show_tooltip.bind(layout),
                    hide_tooltip: layout.hide_tooltip.bind(layout),
                    move_tooltip: layout.move_tooltip.bind(layout)
                });

                charts.line_chart.render('#stats-tempo', stats.data.tempo, {
                    value: 'tempo',
                    small: layout.small,
                    show_tooltip: layout.show_tooltip.bind(layout),
                    hide_tooltip: layout.hide_tooltip.bind(layout),
                    move_tooltip: layout.move_tooltip.bind(layout),
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

                charts.locations_breakdown.render('#locations-breakdown', stats.data.locations_breakdown, {
                    small: layout.small,
                    show_tooltip: layout.show_tooltip.bind(layout),
                    hide_tooltip: layout.hide_tooltip.bind(layout),
                    move_tooltip: layout.move_tooltip.bind(layout)
                });

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
