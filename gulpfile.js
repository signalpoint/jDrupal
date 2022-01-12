// To speed up development, set this to false and...
// - use jdrupal.js instead of jdrupal.min.js in index.html
var makeBinary = true;

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var jDrupalSrc = [

  './src/core.js',
  './src/includes/module.inc.js',
  './src/comment.js',
  './src/entity.js',
  './src/file.js',
  './src/node.js',
  './src/taxonomy_term.js',
  './src/taxonomy_vocabulary.js',
  './src/user.js',
  './src/services/services.js',
  './src/services/services.comment.js',
  './src/services/services.entity.js',
  './src/services/services.file.js',
  './src/services/services.node.js',
  './src/services/services.system.js',
  './src/services/services.taxonomy_term.js',
  './src/services/services.taxonomy_vocabulary.js',
  './src/services/services.user.js'
];

// Minify JavaScript
function minifyJs() {
  console.log('compressing jdrupal.js...');
  var jDrupalJs = gulp.src(jDrupalSrc)
    .pipe(gp_concat('jdrupal.js'))
    .pipe(gulp.dest('./'));
  if (makeBinary) {
    console.log('compressing jdrupal.min.js...');
    return jDrupalJs.pipe(gp_rename('jdrupal.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('./'));
  }
  return jDrupalJs;
}
gulp.task(minifyJs);

gulp.task('default', function(done) {

  gulp.watch(jDrupalSrc, gulp.series('minifyJs'));

  done();

});
