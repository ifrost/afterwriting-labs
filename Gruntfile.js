module.exports = function (grunt) {

	grunt.initConfig({
		watch: {
			templates: {
				files: ['**/*.hbs'],
				tasks: ['handlebars'],
				options: {
					spawn: false,
				},
			},
		},
		handlebars: {
			compile: {
				options: {
					amd: true
				},
				files: {
					'templates/compiled.js': ['**/*.hbs', '**/*.fountain']
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					optimize: "uglify",
					baseUrl: "js",
					mainConfigFile: 'js/afterwriting-bootstrap.js',
					include: "afterwriting-bootstrap",
					name: "libs/almond",
					out: "bundle/js/afterwriting.js",
					onBuildWrite: function (moduleName, path, contents) {
						if (moduleName === 'logger') {
							contents = contents.replace(/\/\/invoke[\s\S]*\/\/\/invoke/g, '');
						} else if (moduleName == 'libs/codemirror/lib/codemirror' || moduleName == 'pdfkit') {
							contents = '';
						}
						return contents;
					},
				}
			}
		},
		concat: {
			bootstrap: {
				options: {
					separator: ''
				},
				src: ['js/main.js', 'js/bootstraps/index.js'],
				dest: 'js/afterwriting-bootstrap.js'

			},
			codemirror: {
				options: {
					separator: ';'
				},
				src: ['bundle/js/afterwriting.js', 'js/libs/codemirror/lib/codemirror.js', 'js/libs/pdfkit.js'],
				dest: 'bundle/js/afterwriting.js'
			},
		},
		clean: {
			bootstrap: ['js/afterwriting-bootstrap.js', 'afterwriting.html']
		},
		cssmin: {
			build: {
				files: {
					'bundle/css/afterwriting.css': ['css/reset.css', 'css/*.css', 'js/libs/**/show-hint.css']
				}
			}
		},
		copy: {
			gfx: {
				expand: true,
				src: ['gfx/**', 'fonts/**'],
				dest: 'bundle'
			},
			html: {
				expand: true,
				flatten: true,
				src: ['html/index.html', 'html/afterwriting.html'],
				dest: ''
			}
		},
		gitcheckout: {
			pages: {
				options: {
					branch: 'gh-pages'
				}
			},
			master: {
				options: {
					branch: 'master'
				}
			}
		},
		gitmerge: {
			master: {
				options: {
					branch: 'master'
				}
			}
		},
		gitpush: {
			pages: {
				options: {
					branch: 'gh-pages'
				}
			}
		},
		compress: {
			build: {
				options: {
					archive: 'afterwriting.zip'
				},
				files: [
					{
						src: 'bundle/**'
					},
					{
						src: 'afterwriting.html'
					}
				]
			}
		},
		replace: {
			last_update: {
				src: ['html/*'],
				overwrite: true,
				replacements: [{
					from: /afterwriting.js[=?0-9a-z\-_]*\"/g,
					to: "afterwriting.js?last_update=<%= grunt.template.today('yyyy-mm-dd_HH-MM') %>\""
                }]
			}
		},
		bumpup: 'package.json'

	});

	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-text-replace');


	grunt.registerTask('build', ['handlebars', 'replace', 'concat:bootstrap', 'requirejs', 'concat:codemirror', 'cssmin', 'copy', 'compress', 'clean']);
	grunt.registerTask('deploy', ['gitcheckout:pages', 'gitmerge:master', 'gitpush:pages', 'gitcheckout:master']);

};