var jdrupal_grunt_src = [
  'src/core.js',
  'src/includes/module.inc.js',
  'src/includes/rest.inc.js',
  'src/includes/views.inc.js',
  'src/entity.js',
  'src/comment.js',
  'src/file.js',
  'src/node.js',
  'src/taxonomy_term.js',
  'src/taxonomy_vocabulary.js',
  'src/user.js'
];

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {},
      build: {
        src: jdrupal_grunt_src,
        dest: '<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: { },
      build: {
        src: jdrupal_grunt_src,
        dest: '<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: jdrupal_grunt_src,
      tasks: ['uglify']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};
