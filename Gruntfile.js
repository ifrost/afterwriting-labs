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
					optimize: "none",
					baseUrl: "js",
					mainConfigFile: "js/main.js",
					include: "main",
					name: "libs/almond",
					out: "build/js/afterwriting.js",
					onBuildWrite: function (moduleName, path, contents) {
						if (moduleName === 'logger') {
							contents = contents.replace(/\/\/invoke[\s\S]*\/\/\/invoke/g, '');
						}
						return contents;
					},
				}
			}
		},
		cssmin: {
			build: {
				files: {
					'build/css/afterwriting.css': ['css/reset.css', 'css/*.css']
				}
			}
		},
		copy: {
			gfx: {
				expand: true,
				src: ['gfx/**', 'fonts/**'],
				dest: 'build'
			},
			html: {
				expand: true,
				flatten: true,
				src: ['html/index.html'],
				dest: 'build'
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

	});

	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-git');


	grunt.registerTask('build', ['requirejs', 'cssmin', 'copy']);

};