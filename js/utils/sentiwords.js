var fs = require('fs');

var data = fs.readFileSync('./sentiwords-1.1.txt', { encoding: 'utf-8' });

var lines = data.split('\n');
var result = [];

var commentIndex = 0;
var comment  = '#\n# This version is modified: it does not contain entries with polarity score of 0, does not include #PoS, and separates word and score with a comma.\n#\n'
result = lines.filter((line, index) => {
    if (line.startsWith('#')) {
        return true;
    } else {
        commentIndex = commentIndex || index;
        var [_, score] = line.split('\t');
        return score !== '0'
    }
}).map((line) => {
    if (line.startsWith('#')) {
        return line;
    } else {
        var [item, score] = line.split('\t');
        var [lemma, pos] = item.split('#');
        return `${lemma},${score}`
    }
});

result.splice(commentIndex, 0, comment);

fs.writeFileSync('./sentiwords.txt', result.join('\n'));