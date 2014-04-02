'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: [ 'src/js/**', 'app/**/*.js' ],
        tasks: ['concat:all'],
        options: {
          livereload: true
        }
      },
      scss: {
        files: ['src/scss/**'],
        tasks: ['sass:dev'],
        options: {
          livereload: true
        }
      },
      views: {
        files: ['app/views/**'],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['server.js', 'app/models/**', 'app/controllers/**'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },
    env: {
      options: {},
      dev: {
        NODE_ENV: 'dev'
      },
      test: {
        NODE_ENV: 'test'
      }
    },
    sass: {
      dev: {
        files: {'public/styles.css': 'src/scss/styles.scss'}
      },
      build: {
        files: {'public/styles.css': 'src/scss/styles.scss'}
      }
    },
    concat: {
      all: {
        src: [
          'src/js/app.js',
          'src/js/locator.js',
          'src/js/postman.js',
          'src/js/actions.js',
          'src/js/heartbeat.js'
        ],
        dest: 'public/app.js'
      }
    },
    express: {
      options: {},
      dev: {
        options: {
          script: 'server.js'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    casper: {
      all: {
        options: {
          test: true
        },
        files: {
          'test/casper/results.xml' : ['test/casper/*.js']
        }
      }
    },
    simplemocha: {
      options: {
        reporter: 'spec',
        slow: 200,
        timeout: 1000,
        node_env: 'test'
      },
      all: {
        src: ['test/mocha/*.js']
      }
    },
    mongoimport: {
      options: {
        db: 'missout-test',
        host: 'localhost',
        stopOnError: false,
        collections: [
          {
            name: 'users',
            type: 'json',
            file: 'db/seeds/users.json',
            jsonArray: true,
            upsertFields: '_id',
            drop: true
          },
          {
            name: 'posts',
            type: 'json',
            file: 'db/seeds/posts.json',
            jsonArray: true,
            //upsertFields: "_id",
            drop: true
          }
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mongoimport');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.registerTask('default', [/*'mongoimport',*/ 'express:dev', 'watch', 'env:dev']);
  grunt.registerTask('test', [ 'env:test', 'mongoimport', 'express:test', 'casper:all', 'simplemocha:all']);
  grunt.registerTask('build', ['sass:build', 'concat:all']);
};