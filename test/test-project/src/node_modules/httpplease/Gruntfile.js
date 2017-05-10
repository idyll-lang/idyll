'use strict';

module.exports = function(grunt) {
  var TEST_SERVER_PORT = process.env.TEST_SERVER_PORT || 4000;

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      standalone: {
        options: {
          browserifyOptions: {
            standalone: 'httpplease'
          }
        },
        files: {
          './browser-builds/standalone/httpplease.js': './lib/index.js'
        }
      },
      plugins: {
        options: {
          browserifyOptions: {
            standalone: 'httppleaseplugins'
          }
        },
        files: {
          './browser-builds/standalone/httppleaseplugins.js': './plugins/index.js'
        }
      }
    },
    uglify: {
      browserbuilds: {
        files: [
          {
            expand: true,
            cwd: './browser-builds/',
            src: '**/*.js',
            dest: './browser-builds/'
          }
        ]
      }
    },
    connect: {
      options: {
        port: TEST_SERVER_PORT,
        base: '.'
      },
      tests: {
        options: {
          keepalive: false
        }
      },
      testskeepalive: {
        options: {
          keepalive: true
        }
      }
    },
    express: {
      testserver: {
        options: {
          hostname: 'localhost',
          port: 4001,
          server: './test/server'
        }
      }
    },
    mocha: {
      all: {
        options: {
          run: true,
          log: true,
          logErrors: true,
          reporter: 'Spec',
          urls: ['http://localhost:' + TEST_SERVER_PORT + '/test/index.html'],
          mocha: {
            grep: grunt.option('grep')
          }
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'Spec',
          clearRequireCache: true,
          grep: grunt.option('grep')
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      lib: {
        files: ['lib/**/*.js'],
        tasks: ['build:standalone']
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        commitFiles: ['-a'],
        createTag: true,
        push: false
      }
    }
  });

  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Define tasks.
  grunt.registerTask('build', ['build:standalone']);
  grunt.registerTask('build:standalone', ['browserify', 'uglify:browserbuilds']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('test:phantom', ['build:standalone', 'runtestserver', 'connect:tests', 'mocha']);
  grunt.registerTask('test:browser', ['build:standalone', 'runtestserver', 'connect:testskeepalive', 'express-keepalive']);
  grunt.registerTask('test:server', ['runtestserver', 'settestglobals', 'mochaTest']);
  grunt.registerTask('test', ['test:phantom', 'settestglobals', 'mochaTest']);
  grunt.registerTask('runtestserver', ['express:testserver']);
  grunt.registerTask('settestglobals', function() {
    // Sets globals for the server tests so we can use the same module for
    // browser tests.
    GLOBAL.chai = require('chai');
    GLOBAL.httpplease = require('./lib/index');
    GLOBAL.httppleaseplugins = require('./plugins');
  });
};
