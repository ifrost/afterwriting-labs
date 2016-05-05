define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["test/screenplays/fdx/header_note.fdx"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<FinalDraft DocumentType=\"Script\" Template=\"No\" Version=\"1\">\n  <Content>\n    <Paragraph Type=\"Scene Heading\">\n      <ScriptNote ID=\"1\">\n        <Paragraph>\n          <Text>Note in scene heading.</Text>\n        </Paragraph>\n      </ScriptNote>\n      <Text>INT. SCENE HEADING - DAY</Text>\n    </Paragraph>\n  </Content>\n</FinalDraft>\n";
  });

this["JST"]["test/screenplays/fdx/note.fdx"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<FinalDraft DocumentType=\"Script\" Template=\"No\" Version=\"1\">\n  <Content>\n    <Paragraph Type=\"Action\">\n      <ScriptNote ID=\"2\">\n        <Paragraph>\n          <Text Font=\"Courier Final Draft\">Note in action. Note. Note. Note.</Text>\n        </Paragraph>\n      </ScriptNote>\n      <Text>Action. Action.</Text>\n    </Paragraph>\n  </Content>\n </FinalDraft>\n";
  });

this["JST"]["test/screenplays/fdx/synopsis.fdx"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<FinalDraft DocumentType=\"Script\" Template=\"No\" Version=\"1\">\n  <Content>\n    <Paragraph Type=\"Scene Heading\">\n      <SceneProperties>\n        <Summary>\n          <Paragraph>\n            <Text>Here is the synopsis.</Text>\n          </Paragraph>\n        </Summary>\n      </SceneProperties>\n      <Text>INT. SCENE HEADING - DAY</Text>\n    </Paragraph>\n  </Content>\n</FinalDraft>\n";
  });

this["JST"]["test/screenplays/client.fountain"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "Title: \n	_Screenplay title_\n	Second line\nCredit: written by\nAuthor: \n	Author 1,\n	**Author 2** & Author 3\nSource: script based on...\nNotes: \n	Additional notes (1)\n	Additional notes (2)\nDate: 01/12/2010\nContact:\n	e-mail: email@email.com\n    phone: +12 34 567 89\nCopyright: Licence info\n\n# Act 1: basic blocks\n\n## Sequence 1: scene heading, action, dialogue, parenthetical\n\nINT. BASIC BLOCKS - DAY\n\nAction. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action.\n\nAction. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action.\n\nHERO 1\nBlah blah blah blah.\n\nHERO 2\nBlah blah.\n(parenthetical)\nBlah blah.\n\nAction. action. action. action.\n\n## Sequence 2: boneyard and notes\n\nEXT. BASIC BLOCKS - NIGHT\n\nAction. Action. Action[[ (inline note)]]. Action.\n\n/*\n\nIgnored.\nIgnored. /* nested */\nIgnored.\n\n*/\n\nAction. action. action. action. /*ignored*/action. action. action. action. action. action. action. action. action. /*ignored /*nested*/ */action. action. action. action. action. action. action.\n\n[[Long long long long long long long long long long long long long long long long long long long long long long long long long long long long long...\n\n...multiline note]]\n\n## Sequence 3: Formatting\n\nINT. FORMATTING - DAY\n\nNormal test, _underline test_, *italic test*, **bold test**, ***bold and italic test***, _*underline and italic test*_, _**underline and bold test_**, _***underline, bold and italic test***_.\n\n_Long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long **(with nested bold)** long long long long underlined text._\n\n> CENTERED, **BOLD**, _UNDERLINE_ <\n\n> TRANSITION:\n\nPage break test...\n\n===\n\n.FORCED HEADER\n\nAction.\n\n# Act 2: Dialogue\n\nINT. SPLIT DIALOGUE - DUSK\n\nAction.\n\nHERO 1\nBlah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.\n\nAction.\n\nINT. DUAL DIALOGUE - NIGHT\n\nAction action.\n\nHERO 1\nBlah!\n\nHERO 2 ^\nBlah!\n\nHERO 3\nBlah?\n\nAction action.\n\n# Act 3: edge cases\n\nINT. LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG SCENE HEADER.\n\nAction.\n\nVERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY LONG NAME\nHello, my name is Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Long Name.\n\n# Act 4: Misc\n\n## Latin characters\n\nINT. LATIN TEST - DAWN\n\nLatin characters.\n\nPOLISH\nPchnąć w tę łódź jeża lub osiem skrzyń fig.\n\nGERMAN\nFalsches Üben von Xylophonmusik quält jeden größeren Zwerg.\n\nNORWEGIAN\nBlåbærsyltetøy\n\nSPANISH\nEl pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro.\n\n## Forced elements\n\n.WNĘTRZE. FORCED ELEMENTS - NIGHT\n\n!INT. ACTION\n\n@McCABE\n~Happy birthday to you!\n\n> FADE TO GREEN.\n\n## Sections and synopsis\n\n= Section synopsis\n\n### Subsection\n\n= Subsection synopsis\n\n= Additional synopsis\n\nINT. SCENE - DAY\n\n= Scene synopsis\n\nAction.\n\n# Act 5: Variables\n\nINT. $LOCATION - DAY\n\n$PROTAGONIST enters the $location. $Antagonist attacks him.\n\n$ANTAGONIST\nAaaaa!\n\n$Protagonists kills $Antagonist.\n\n$BOND.LAST\nMy name is $bond.last, $bond.name.\n\n> THE END.\n";
  });

this["JST"]["test/screenplays/fdx/header_note.fountain"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\nINT. SCENE HEADING - DAY\n\n[[Note in scene heading.]]\n";
  });

this["JST"]["test/screenplays/fdx/note.fountain"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\nAction. Action. [[Note in action. Note. Note. Note.]]\n";
  });

this["JST"]["test/screenplays/fdx/synopsis.fountain"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\nINT. SCENE HEADING - DAY\n\n= Here is the synopsis.\n";
  });

this["JST"]["test/screenplays/test.fountain"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "[[Script note.\n- blah blah blah\n- blah blah blah\n]]\n\nTitle: \n	_Screenplay title_\n	Second line\nCredit: written by\nAuthor: \n	Author 1,\n	**Author 2** & Author 3\nSource: script based on...\nNotes: \n	Additional notes (1)\n	Additional notes (2)\nDate: 01/12/2010\nContact:\n	e-mail: email@email.com\n    phone: +12 34 567 89\nCopyright: Licence info\n\n# Act 1: basic blocks\n\n## Sequence 1: scene heading, action, dialogue, parenthetical\n\nINT. BASIC BLOCKS - DAY\n\nAction. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action.\n\nAction. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action. action.\n\nHERO 1\nBlah blah blah blah.\n\nHERO 2\nBlah blah.\n(parenthetical)\nBlah blah.\n\nAction. action. action. action.\n\n## Sequence 2: boneyard and notes\n\nEXT. BASIC BLOCKS - NIGHT\n\nAction. Action. Action[[ (inline note)]]. Action.\n\n/*\n\nIgnored.\nIgnored. /* nested */\nIgnored.\n\n*/\n\nAction. action. action. action. /*ignored*/action. action. action. action. action. action. action. action. action. /*ignored /*nested*/ */action. action. action. action. action. action. action.\n\n[[Long long long long long long long long long long long long long long long long long long long long long long long long long long long long long...\n\n...multiline note]]\n\n## Sequence 3: Formatting\n\nINT. FORMATTING - DAY\n\nNormal test, _underline test_, *italic test*, **bold test**, ***bold and italic test***, _*underline and italic test*_, _**underline and bold test_**, _***underline, bold and italic test***_.\n\n_Long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long **(with nested bold)** long long long long underlined text._\n\nEXT. ESCAPING FORMATTING - NIGHT\n\nWhat the f\\*ck! Escape\\_escape\\*escape. \n\n> CENTERED, **BOLD**, _UNDERLINE_ <\n\n> TRANSITION:\n\nPage break test...\n\n===\n\n.FORCED HEADER\n\nAction.\n\n# Act 2: Dialogue\n\nINT. SPLIT DIALOGUE - DUSK\n\nAction.\n\nHERO 1\nBlah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.\n\nAction.\n\nINT. DUAL DIALOGUE - NIGHT\n\nAction action.\n\nHERO 1\nBlah!\n\nHERO 2 ^\nBlah!\n\nHERO 3\nBlah?\n\nAction action.\n\n# Act 3: edge cases\n\nINT. LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG SCENE HEADER.\n\nAction.\n\nVERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY VERY LONG NAME\nHello, my name is Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very Long Name.\n\n# Act 4: Misc\n\n## Latin characters\n\nINT. LATIN TEST - DAWN\n\nLatin characters.\n\nPOLISH\nPchnąć w tę łódź jeża lub osiem skrzyń fig.\n\nGERMAN\nFalsches Üben von Xylophonmusik quält jeden größeren Zwerg.\n\nNORWEGIAN\nBlåbærsyltetøy\n\nSPANISH\nEl pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro.\n\n## Forced elements\n\n.WNĘTRZE. FORCED ELEMENTS - NIGHT\n\n!INT. ACTION\n\n@McCABE\n~Happy birthday to you!\n\n> FADE TO GREEN.\n\n## Sections and synopsis\n\n= Section synopsis\n\n### Subsection\n\n= Subsection synopsis\n\n= Additional synopsis\n\nINT. SCENE - DAY\n\n= Scene synopsis\n\nAction.\n\n> THE END.\n";
  });

return this["JST"];

});