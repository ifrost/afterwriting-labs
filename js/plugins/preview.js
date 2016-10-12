define(function (require) {
	
	var Section = require('aw-bubble/model/section'),
        PreviewView = require('templates/plugins/preview-view'),
        PreviewViewMenu = require('templates/plugins/preview-view-menu'),
      pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		decorator = require('utils/decorator'),
		pdfmaker = require('utils/pdfmaker'),
        data = require('modules/data');

    var section = Section.create('preview');
    section.title = 'Preview';
    section.shortTitle = 'view';
    section.isVisibleInMenu = false;
    section.description = 'Can\'t see anything? You need a PDF plugin in your browser. (You can download pdf from <a class="switch" href="#" plugin="save">here</a>)';
    section.smallIcon = 'gfx/icons/preview.svg';
    section.mainContent = PreviewView.create();
    section.tools = PreviewViewMenu.create();

    data.script.add(function(){
        section.isVisibleInMenu = true;
    });

    var plugin = pm.create_plugin(null, null, null, section);
	
	plugin.get_pdf = function(callback) {
		pdfmaker.get_pdf(callback);
	};

	plugin.refresh = decorator.signal();
	
	plugin.activate = function() {
		editor.synced.add(plugin.refresh);
		plugin.refresh();
	};
	
	plugin.deactivate = function() {
		editor.synced.remove(plugin.refresh);
	};
	
	return plugin;
});