var stdio = require('stdio');
var options = stdio.getopt({
    'regular': {
        key: 'r',
        args: 1,
        description: "Regular font file.",
        mandatory: true
    },
    'bold': {
        key: 'b',
        args: 1,
        description: "Bold font file."
    },
    'italic': {
        key: 'i',
        args: 1,
        description: "Italic font file."
    },
    'bolditalic': {
        key: 'x',
        args: 1,
        description: "Bold-italic font file."
    },
    'output': {
        key: 'o',
        args: 1,
        description: "Output file",
        mandatory: true
    }
});

var fs = require("fs");
var path = require("path");

function load(options, type, required) {
    var name = options[type];
    if (!name) {
        console.log(type + " font not specified. Regular font will be used instead.");
        return "fonts.regular;";
    }
    try {
        var content = fs.readFileSync(path.join(name));
        var buf = new Buffer(content);
        return '"' + buf.toString('base64') + '";';
    } catch (e) {
        if (!required) {
            console.log(type + " font not found. File name: " + name + ". Regular font will be used instead.");
            return "fonts.regular;";
        } else {
            console.error(type + " font not found.");
            throw e;
        }
    }
}

var regular = load(options, "regular", true);
var bold = load(options, "bold");
var italic = load(options, "italic");
var bolditalic = load(options, "bolditalic");

var output = `define(function(require){\n\n`;
output += `    var fontUtils = require('utils/font-utils');\n\n`;
output += `    var fonts = {};\n\n`;
output += `    fonts.regular = ${regular}\n\n`;
output += `    fonts.bold = ${bold}\n\n`;
output += `    fonts.italic = ${italic}\n\n`;
output += `    fonts.bolditalic = ${bolditalic}\n\n`;

output += `    return {\n\n`;
output += `        regular: fontUtils.convertBase64ToBinary(fonts.regular),\n\n`;
output += `        bold: fontUtils.convertBase64ToBinary(fonts.bold),\n\n`;
output += `        italic: fontUtils.convertBase64ToBinary(fonts.italic),\n\n`;
output += `        bolditalic: fontUtils.convertBase64ToBinary(fonts.bolditalic)\n\n`;
output += `    };\n\n`;
output += `});\n`;

fs.writeFileSync(options.output, output, {encoding: "utf-8"});