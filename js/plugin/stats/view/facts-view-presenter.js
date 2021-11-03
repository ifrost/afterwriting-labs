define(function(require) {

    var BaseSectionViewPresenter = require('theme/aw-bubble/presenter/base-section-view-presenter'),
        queries = require('plugin/stats/model/queries'),
        fhelpers = require('utils/fountain/helpers');

    var FactsViewPresenter = BaseSectionViewPresenter.extend({

        settings: {
            inject: 'settings'
        },
        
        scriptModel: {
            inject: 'script'
        },

        _facts: null,
        
        _scriptChanged: function() {
            this.view.facts = this._generateData();
            this.view.eachSceneOnNewPage = this.settings.each_scene_on_new_page;
            this.view.primaryCharacters = this._getCharactersByLevel(1);
            this.view.secondaryCharacters = this._getCharactersByLevel(2);
        },
        
        _generateData: function () {

            var basics = this.scriptModel.getBasicStats();
            this._facts = basics;
            var facts = this._facts;

            facts.title = fhelpers.first_text('title', this.scriptModel.parsed.title_page, '');

            facts.characters = queries.characters.run(this.scriptModel.parsed_stats.tokens, basics, {sort_by: 'lines'});
            facts.locations = queries.locations.run(this.scriptModel.parsed_stats.tokens);
            facts.readability = queries.readability.run(this.scriptModel.parsed_stats.tokens);

            console.log('FR: 70-80 is good');
            console.log('SMOG: 9 is good, 15 is bad');

            console.log(facts.readability);
            // console.log('action:', 'FR =', facts.readability.scores.action.medianGrade);
            // console.log('dialogue:', 'FR =', facts.readability.scores.dialogue.medianGrade);
            // console.log('all:', 'FR =', facts.readability.scores.all.medianGrade);

            // fleschReadingEase
            // https://readable.com/features/readability-formulas/#flesch
            // 1-100
            // The average adult can read a text with a Reading Ease score of 70-80.




            // smogIndex
            // https://readable.com/features/readability-formulas/#smog
            // It is a readability framework. It measures how many years of education the average person needs to have to understand a text.
            // 9 - good (primary school)
            // 12 - high school
            // 15 - bad (uni)

            return facts;
        },

        _getCharactersByLevel: function(level) {
            return this._facts.characters.filter(function(character){
                return character.level === level;
            });
        }
        
    });

    return FactsViewPresenter;
});