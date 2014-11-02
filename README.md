afterwriting-labs
=================

Screenwriting experiments :)

App site: http://afterwriting.com

Developmnet
===========

Project Structure
-----------------

* bundle - production files (see grunt build)
* css - stylesheets
* fonts - DayRoman font
* gfx - all graphics/icons
* html - main production HTML files
  * index.html - used on afterwriting.com
  * afterwriting.html - for the offline version
* js - source files
* templates - handlebar templates
  * plugins - plugin templates
  * samples - sample scripts saved as handlebar templates
  * compiled.js - compiled templates (see grunt handlebars / grunt watch)
  * layout.hbs - main layout template
* test - test script
* afterwriting.zip - offline version (see grunt build)
* dev.html - development main HTML 

JS files
--------

* bootstraps - entry points for different environments (dev, prod, test); contains list of used plugins and modules; included in main HTML
* libs - external libs
* modules - modules loaded by bootstrap using modules lifecycle
* plugins - plugins (modules with views)
* utils - misc files and helpers
* bootstrap.js - main entry point; loads plugins and modules; creates main layout view and plugin views
* main.js - main require.js config


Grunt tasks
-----------

    grunt watch - compile templates on a file change
	grunt build - prepare production build
	
How to create a plugin?
-----------------------

How to extract data from a script?
----------------------------------

How to create a chart?
----------------------
