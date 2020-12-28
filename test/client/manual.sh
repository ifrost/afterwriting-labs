# Manual tests scenarios
# cd afterwriting-labs
# ./test/client/manual.sh

# Generate a PDF with a custom font:
node tools/fonts-converter --regular test/client/fonts/1942.ttf --output test/client/fonts/1942.js
node awc.js --source test/data/screenplays/test.fountain --fonts ./test/client/fonts/1942 --overwrite --pdf test/client/pdf/1942.pdf

# Generate a PDF with snippets in a config:
node awc.js --source test/data/screenplays/client.fountain --config test/client/config/client.json --overwrite --pdf test/client/pdf/client.pdf

# Generate a PDF with a supported font:
node awc.js --source test/data/screenplays/cyrillic.fountain --setting font_family=CourierPrimeCyrillic --overwrite --pdf test/client/pdf/cyrillic.pdf
# node awc.js --source test/data/screenplays/jp.fountain --setting font_family=Kosugi --overwrite --pdf test/client/pdf/jp.pdf
# node awc.js --source test/data/screenplays/sc.fountain --setting font_family=Kosugi --overwrite --pdf test/client/pdf/sc.pdf