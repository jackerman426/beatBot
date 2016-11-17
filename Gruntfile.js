module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    jsdoc: {
      dist: {
        src: [
          './*.js',
          './api/*.js',
          './controllers/*.js',
          './tasks/*.js',
          './lib/*.js',
          './jobs/*.js'
        ],
        jsdoc: './node_modules/.bin/jsdoc',
        options: {
          destination: 'docs/jsdocs',
          configure: './node_modules/jsdoc/conf.json.EXAMPLE'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-jsdoc');
};
