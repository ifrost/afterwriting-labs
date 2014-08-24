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
					mainConfigFile: "js/main.js",
					include: "main",
					name: "libs/almond",
					out: "bundle/js/afterwriting.js",
					onBuildWrite: function (moduleName, path, contents) {
						if (moduleName === 'logger') {
							contents = contents.replace(/\/\/invoke[\s\S]*\/\/\/invoke/g, '');
						} else if (moduleName == 'libs/codemirror/lib/codemirror') {
							contents = '';
						}
						return contents;
					},
				}
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: ['bundle/js/afterwriting.js', 'js/libs/codemirror/lib/codemirror.js'],
				dest: 'bundle/js/afterwriting.js',
			},
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
				src: ['html/index.html'],
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
						src: 'index.html'
					}
				]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-git');


	grunt.registerTask('build', ['requirejs', 'concat', 'cssmin', 'copy', 'compress']);
	grunt.registerTask('deploy', ['gitcheckout:pages', 'gitmerge:master', 'gitpush:pages', 'gitcheckout:master']);

};