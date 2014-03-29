module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: [ 'src/js/**', 'app/**/*.js' ],
        tasks: ['concat:dev'],
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
      dev: {
        src: [
          'src/js/app.js',
          'src/js/locator.js',
          'src/js/postman.js'
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
      test: {
        src: ['test/mocha/**'],
        options: {
          reporter: 'spec',
          slow: 200,
          timeout: 1000,
          node_env: 'test'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.registerTask('default', ['express:dev', 'watch', 'env:dev']);
  grunt.registerTask('test', ['env:test', 'express:test', 'casper:all']);
};
