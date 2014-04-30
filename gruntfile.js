/*
 *
 * Copyright (c) 2014 eXist Solutions
 * Licensed under the MIT license.
 */

'use strict';

/* jshint indent: 2 */

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
//    require('time-grunt')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-uncss');


    // Project configuration.
    grunt.initConfig({
        xar: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'gruntfile.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['build','dist']
        },

        /*
        removes unused CSS rules by investigating the imports of html files. Used to strip down e.g. bootstrap to
        the actual used amount of rules.
         */
        uncss: {
            options:{
                ignore:['.collapsing','.navbar-collapse.collapse','.collapse.in', /.band-news.+\b/ , /.news-row.+\b/],
                flatten:true
            },
            dist: {
                src: ['./templates/page.html'],
                dest: 'resources/css/tidy.css'
            }
        },

        processhtml: {
            dist: {
                options:{
                    data:{
                        minifiedCss:'<link href="resources/css/app.min.css" rel="stylesheet"/>'
                    }
                },
                files: {
                    'dist/templates/page.html': ['templates/page.html']
                }
            }
        },

        cssmin: {
            dist: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: 0,
                    report: 'min'
                },
                files: {
                    'dist/resources/css/app.min.css': '<%= uncss.dist.dest %>'
                }
            }
        },



        // CSS and JS resources are copied as they get processed by their respective optimization tasks later in the chain.
        // png images will not be copied as they will get optimized by imagemin
        copy: {
            dist: {
                files: [
                    {expand: true,
                     cwd: './',
                     src: ['resources/img/**', 'templates/**','*.xql', '*.xml', '*.txt', '*.ico', '*.html'],
                     dest: 'dist/'},

                    {expand:true,
                        cwd:'./',
                        flatten:true,
                        src:['components/font-awesome/fonts/**'],
                        dest:'dist/fonts/',
                        filter:'isFile'
                    }
                ]
            }
        },

        /*
        replaces tokens in expath-pkg.tmpl and creates expath-pkg.xml with substituted values
        */
        replace: {
            pkg: {
                src: ['expath-pkg.tmpl'],
                dest: 'expath-pkg.xml',
                replacements: [{
                    from: '@APPVERSION@',
                    to: '<%= xar.version %>'
                },{
                    from:'@APPNAME@',
                    to:'<%= xar.name %>'
                },{
                    from:'@APPDESCRIPTION@',
                    to:'<%= xar.description %>'
                }]
            }
        },

        /*
        optimizes images for the web. Currently only .png files are considered. This might be extended later.
        */
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [
                    {
                        // Set to true to enable the following options…
                        expand: true,
                        // cwd is 'current working directory'
                        cwd: './resources/img/',
                        src: ['**/*.png'],
                        // Could also match cwd line above. i.e. project-directory/img/
                        dest: 'dist/resources/img/',
                        ext: '.png'
                    }
                ]
            }
        },

        /*
        minifies the file 'resources/js/app.js'. Creates a minified version 'app.min.js'. Using a fixed and unconfigurable
        name makes substitution in html page easier - see build comments at the end of html files.
        */
        uglify: {
            dist: {
                files: {
                    'resources/js/app.min.js': [
                        'resources/js/app.js'
                    ]
                }
            }
        },

        /*

        */
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                stripBanners:true
            },
            dist: {
                // the files to concatenate - use explicit filenames here to ensure proper order
                // puts app.js at the end.
                src: [
                    'components/jquery/dist/jquery.min.js',
                    'components/bootstrap/dist/js/bootstrap.min.js',
                    'components/snap.svg/dist/snap.svg-min.js',
                    'resources/js/app.min.js'],
                // the location of the resulting JS file
                dest: 'dist/resources/js/app.min.js'
            }
        } ,

        /*
        Gives statistical information about CSS compression results
        */
        compare_size: {
            files: [
                'resources/css/*.css',
                'dist/resources/css/app.min.css'
            ]
        },

        /*
        this task builds the actual .xar apps for deployment into eXistdb. zip:xar will create an unoptimized version while
        zip:production will use the optimized app found in the 'dist' directory.
        */
        zip:{
            xar:{
                src:['collection.xconf','*.xml','*.xql','*.html','components/**','modules/**','resources/**','templates/**'],
                dest:'build/<%=xar.name%>-<%=xar.version%>.xar'
            },
            production:{
                src:['dist/**'],
                dest:'build/<%=xar.name%>-<%=xar.version%>.min.xar'
            }
        },

        /*
        watches gruntfile itself and checks for problems
        */
        watch: {
            files: ['gruntfile.js'],
            tasks: ['jshint']
        }



    });

    /*
     */
    grunt.registerTask('default', [
        'replace',
        'zip:xar'
    ]);

    grunt.registerTask('dist', [
        'clean',
        'replace',
        'copy',
        'imagemin',
        'uglify',
        'concat',
        'uncss',
        'cssmin',
        'processhtml',
        'compare_size',
        'zip:production'
    ]);




};
