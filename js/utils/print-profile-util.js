define(function(require) {

    var _ = require('lodash'),
        fs = require('fs'),
        YAML = require('yamljs'),
        Protoplast = require('protoplast');

    var PrintProfileUtil = Protoplast.extend({
        loadProfile: function(profileLocation) {
            var rawData = fs.readFileSync(profileLocation, 'utf8');
            var matchMaxRgx = /default_max:\s*([&A-Za-z]*)\s*(\d+)/;
            var matchBaseRgx = /base:\s*[",']?([A-Za-z0-9]*)[",']?/;

            var matchBase = rawData.match(matchBaseRgx);
            var base = null;
            var baseData = {};
            
            if(matchBase != null && matchBase.length > 1) {
                // get contents of base file
                base = fs.readFileSync('print-profiles/' + matchBase[1] + '.yml', 'utf8');
                // replace default_max in base file with the new file                
                var baseDefMax = base.match(matchMaxRgx);
                var srcDefMax = rawData.match(matchMaxRgx);
                if (baseDefMax)   {
                    var newString = "default_max: " + 
                    (baseDefMax[1] != null && baseDefMax[1] == null ? "" : baseDefMax[1]) +
                    " " + 
                    srcDefMax[2];
                    
                    base = base.replace(baseDefMax[0], newString);
                    
                }

                baseData = YAML.parse(base);
                profileData = Object.assign(baseData, YAML.parse(rawData));
            } else { 
                profileData = YAML.parse(rawData);
            }                                    
    
            return profileData;
        },
        /**
         * 
         * @param {number} defaultMax 
         * @param {object} source 
         * @param {NULL|object} base 
         * @returns {object}
         */
        loadFiles: function() {
            var dir = 'print-profiles';
            var result = {};
            try {
                var files = fs.readdirSync(dir, { withFileTypes: true });
                var $vm = this;                            
                files.forEach(function(file) {
                    if (file.isFile() && file.name.indexOf('.yml')) {
                        var profile = $vm.loadProfile(dir + "/" + file.name);
                        result[profile.name] = profile;                        
                    }
                });
            
            } catch (err) {
                console.log(err);
            }

            return result;
        },

        /**
         * Create new profile based on a given sourceProfile and change the font size
         *
         * @param {object} sourceProfile
         * @param {number} fontSize
         *
         * @returns {object}
         */
        withNewFontSize: function(sourceProfile, fontSize) {

            var profile = _.cloneDeep(sourceProfile);
            
            var up = fontSize / profile.font_size,
                down = profile.font_size / fontSize;

            profile.font_size = fontSize;
            profile.lines_per_page = Math.floor(profile.lines_per_page * down);
            profile.font_width = profile.font_width * up;
            profile.font_height = profile.font_height * up;

            Object.keys(profile).forEach(function(key) {
                if (typeof (profile[key]) === "object") {
                    profile[key].max = Math.floor(profile[key].max * down);
                }
            });

            return profile;
        }

    });

    return PrintProfileUtil;
});