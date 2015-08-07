var jdrupal_grunt_src = [
  'src/drupal.js',
  'src/includes/module.inc.js',
  'src/comment.js',
  'src/entity.js',
  'src/file.js',
  'src/node.js',
  'src/taxonomy_term.js',
  'src/taxonomy_vocabulary.js',
  'src/user.js',
  'src/services/services.js',
  'src/services/services.comment.js',
  'src/services/services.entity.js',
  'src/services/services.file.js',
  'src/services/services.node.js',
  'src/services/services.system.js',
  'src/services/services.taxonomy_term.js',
  'src/services/services.taxonomy_vocabulary.js',
  'src/services/services.user.js'
];

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: { },
      dist: {
        src: jdrupal_grunt_src,
        dest: 'bin/<%= pkg.name %>.js',
      },
    },
    uglify: {
      options: { },
      build: {
        src: jdrupal_grunt_src,
        dest: 'bin/<%= pkg.name %>.min.js'
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

