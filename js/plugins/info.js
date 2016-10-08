define(function(require){
	var Section = require('aw-bubble/model/section'),
        InfoView = require('templates/plugins/info-view'),
      common = require('utils/common'),
      pm = require('utils/pluginmanager'),
		decorator = require('utils/decorator');

    var section = Section.create('info');
    section.title = 'Info';
    section.shortTitle = 'info';
    section.smallIcon = 'gfx/icons/info.svg';
    section.mainContent = InfoView.create();
    
    var plugin = pm.create_plugin(null, null, null, section);
	plugin.class = "active";
	
	plugin.download_clicked = decorator.signal();
	
	return plugin;
});