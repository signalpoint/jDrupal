var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var moduleSrc = [

  './src/core.js',
  './src/includes/module.inc.js',
  './src/includes/rest.inc.js',
  './src/includes/views.inc.js',
  './src/includes/views.inc.js',
  './src/entity.js',
  './src/comment.js',
  './src/file.js',
  './src/node.js',
  './src/taxonomy_term.js',
  './src/taxonomy_vocabulary.js',
  './src/user.js'

];

// Minify JavaScript
function minifyJs() {
  console.log('compressing jdrupal.js...');
  var moduleJs = gulp.src(moduleSrc)
    .pipe(gp_concat('jdrupal.js'))
    .pipe(gulp.dest('./'));
    console.log('compressing jdrupal.min.js...');
  return moduleJs.pipe(gp_rename('jdrupal.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('./'));
}
gulp.task(minifyJs);

gulp.task('default', function(done) {

  gulp.watch(moduleSrc, gulp.series('minifyJs'));

  done();

});
