module.exports = function (grunt) {
    grunt.initConfig({
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        uglify: {
            library: {
                options: {
                    sourceMap: true,
                    sourceMapName: './dist/eventManager.min.js.map'
                },
                files: {
                    './dist/eventManager.min.js': [
                        './src/eventManager.js'
                    ]
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['src/eventManager.js']
        },
        coveralls: {
            options: {
                coverage_dir: './coverage',
                dryRun: false,
                force: true,
                recursive: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['jshint', 'test', 'uglify']);
    grunt.registerTask('travis', ['jshint', 'test', 'coveralls']);
};
