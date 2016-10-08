define(function(require) {

    var template = require('text!templates/plugins/facts.hbs'),
        $ = require('jquery'),
        helper = require('utils/helper'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            var facts = this.plugin;

            var handlers_added = false;

            facts.refresh.add(function() {
                var facts_data = facts.data.facts;
                $('#facts-title').html(facts_data.title.replace(/\*/g, '').replace(/_/g, '').replace(/\n/g, ' / ') || '-');

                var pages_text = facts_data.pages.toFixed(2);
                var eights = helper.eights(facts_data.pages),
                    eights_text = eights ? ' ~ ' + eights : '';
                pages_text += eights_text;
                if (facts.each_scene_on_new_page()) {
                    pages_text += ' ~ ' + facts_data.filled_pages.toFixed(2) + ' without page breaks';
                }
                $('#facts-pages').html(pages_text);

                $('#facts-time').html(helper.format_time(facts_data.filled_pages));
                $('#facts-scenes').html(facts_data.scenes + ' (action only: ' + facts_data.action_scenes + ', with dialogue: ' + facts_data.dialogue_scenes + ')');
                $('#facts-action-time').html(helper.format_time(facts_data.action_time));
                $('#facts-dialogue-time').html(helper.format_time(facts_data.dialogue_time));

                var primary_characters = facts.get_characters_by_level(1).map(function(ch) {
                    return ch.name
                }).join(', ');
                $('#facts-primary-characters').html(primary_characters || '-');
                var secondary_characters = facts.get_characters_by_level(2).map(function(ch) {
                    return ch.name
                }).join(', ');
                $('#facts-secondary-characters').html(secondary_characters || '-');

                $('#facts-characters').empty();
                var character_scenes;
                for (var i = 0; i < facts_data.characters.length; i++) {
                    character_scenes = facts_data.characters[i].scenes.length;
                    character_scenes = character_scenes.toString() + (character_scenes === 1 ? ' scene' : ' scenes');

                    $('#facts-characters').append('<li class="' + (i >= 10 ? 'expandable' : '') + '">' + facts_data.characters[i].name + ' (' + helper.format_time(facts_data.characters[i].time) + ', ' + character_scenes + ')</li>');
                }

                $('#facts-locations').empty();
                for (var i = 0; i < facts_data.locations.length; i++) {
                    $('#facts-locations').append('<li class="' + (i >= 10 ? 'expandable' : '') + '">' + facts_data.locations[i].name + ' (' + facts_data.locations[i].count + ')</li>');
                }
                $('.nof-dialogues').html(facts_data.characters.length);
                $('.nof-locations').html(facts_data.locations.length);


                if (facts_data.characters.length === 0) {
                    $('#facts-time-of-speaking-container').hide();
                }
                else {
                    $('#facts-time-of-speaking-container').show();
                }

                if (facts_data.characters.length > 10) {
                    $('.show-all-dialogues').show();
                    $('.show-top-dialogues').hide();
                    $('#facts-characters li.expandable').hide();
                } else {
                    $('.expand-dialogue').hide();
                }

                if (facts_data.locations.length === 0) {
                    $('#facts-locations-contaner').hide();
                }
                else {
                    $('#facts-locations-contaner').show();
                }

                if (facts_data.locations.length > 10) {
                    $('.show-all-locations').show();
                    $('.show-top-locations').hide();
                    $('#facts-locations li.expandable').hide();
                } else {
                    $('.expand-locations').hide();
                }

                if (!handlers_added) {
                    $('.expand-dialogue').click(function() {
                        if ($(this).hasClass('show-all-dialogues')) {
                            $('.show-all-dialogues').hide();
                            $('.show-top-dialogues').show();
                        } else {
                            $('.show-all-dialogues').show();
                            $('.show-top-dialogues').hide();
                        }
                        $('#facts-characters li.expandable').slideToggle({
                            duration: 200
                        });
                    });
                    $('.expand-locations').click(function() {
                        if ($(this).hasClass('show-all-locations')) {
                            $('.show-all-locations').hide();
                            $('.show-top-locations').show();
                        } else {
                            $('.show-all-locations').show();
                            $('.show-top-locations').hide();
                        }
                        $('#facts-locations li.expandable').slideToggle({
                            duration: 200
                        });
                    });
                    handlers_added = true;
                }
            });
        }

    });

});

