define('utils/fountain/preprocessor', function(require) {

    var module = {};

    var capitalize = function(text) {
        return text.charAt(0).toLocaleUpperCase() + text.slice(1);
    };

    var chain_values = function(current, next) {
        return current ? (current + '.' + next) : next;
    };

    var merge_keys = function(obj, result, chain) {
        chain = chain || "";
        Object.keys(obj).forEach(function(key) {
            if (typeof (obj[key]) === "string") {
                result[chain_values(chain, key)] = obj[key];
            } else {
                merge_keys(obj[key], result, chain_values(chain, key));
            }
        });
    };

    var replaceAll = function(text, value, new_value) {
        return text.replace(new RegExp(value, "g"), new_value);
    };

    module.process_snippets = function(text, settings) {
        variables = settings.snippets
        var merged_variables = {}, all_variables;

        merge_keys(variables || {}, merged_variables);

        all_variables = Object.keys(merged_variables);

        all_variables.sort(function(a, b) {
            var a_value = merged_variables[a];
            if (a_value.toLocaleUpperCase().indexOf(b.toLocaleUpperCase()) !== -1) {
                return -1;
            }
            else {
                return 1;
            }
        });

        all_variables.forEach(function(variable) {
            text = replaceAll(text, '\\$' + variable, merged_variables[variable]);
            text = replaceAll(text, '\\$' + variable.toLocaleUpperCase(), merged_variables[variable].toLocaleUpperCase());
            text = replaceAll(text, '\\$' + capitalize(variable), capitalize(merged_variables[variable]));
        });

        // Replace static variables
        if(settings.revision_hash){

            // From https://stackoverflow.com/a/35778030/1649917
            revision_hash = require('child_process')
                                .execSync('git rev-parse --short HEAD')
                                .toString().trim()

            text = replaceAll(text, '\\$REVISION', revision_hash)
        }

        if(settings.auto_date){
            var dayjs = require('dayjs')

            // TODO: Add configurable date with dayjs format string 
            // https://github.com/iamkun/dayjs/blob/master/docs/en/API-reference.md#format-formatstringwithtokens-string
            var date_string = dayjs().format('YYYY-MM-DD')
            text = replaceAll(text, '\\$DATE', date_string)
        }

            

        return text;
    };

    return module;

});