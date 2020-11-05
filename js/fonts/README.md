# How to add a new font?

1. Copy font files to afterwriting-labs/js/fonts/source/FolderWithMyFonts
2. Generate JSONP file with fonts using:
    cd afterwriting-labs/js/fonts
    node fonts-converter.js -r source/FolderWithMyFonts/MyFont-Regular.ttf -b source/FolderWithMyFonts/MyFont-Bold.ttf -i source/FolderWithMyFonts/MyFont-Italic.ttf -x source/FolderWithMyFonts/MyFont-Bold-Italic.ttf -o my-font.js
3. Make font available for loading in: afterwriting-labs/js/utils/fonts.js
4. Make font embedded in node.js: afterwriting-labs/js/utils/fonts-node.js
5. Make new font available in settings. Add font_family entry in: afterwriting-labs/js/plugin/settings/model/settings-config-provider.js

# Sources:

## courier-prime.js

Courier Prime: https://quoteunquoteapps.com/courierprime/downloads/courier-prime.zip

node ../../fonts-converter.js -r source/Courier-Prime/Courier-Prime.ttf -b source/Courier-Prime/Courier-Prime-Bold.ttf -i source/Courier-Prime/Courier-Prime-Italic.ttf -x source/Courier-Prime/Courier-Prime-Bold-Italic.ttf -o courier-prime.js

## courier-prime-cyrillic
Courier Prime Cyrillic: http://dimkanovikov.pro/courierprime/courierprime.zip

node ../../fonts-converter.js -r source/Courier-Prime-Cyrillic/Courier-Prime.ttf -b source/Courier-Prime-Cyrillic/Courier-Prime-Bold.ttf -i source/Courier-Prime-Cyrillic/Courier-Prime-Italic.ttf -x source/Courier-Prime-Cyrillic/Courier-Prime-Bold-Italic.ttf -o courier-prime-cyrillic.js

# kosugi

node ../../tools/fonts-converter.js -r source/Kosugi/Kosugi-Regular.otf -o kosugi.js
