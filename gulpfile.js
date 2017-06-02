var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    compressJS = require('gulp-uglify');


gulp.task('default', function() {
  // place code for your default task here
});


gulp.task('minify-css', function() {
    gulp.src('./css/main.css')
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('./css/'));
});

var uglify = require('gulp-uglify');

gulp.task('compress-js', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});