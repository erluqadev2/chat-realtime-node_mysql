var gulp = require('gulp');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var stylus = require('gulp-stylus');


gulp.task('notificaciones', function() {
     return browserify('./sources/javascripts/notificaciones.js')
    .bundle()
    .pipe(source('notificaciones.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts'))
});

gulp.task('chat', function() {
     return browserify('./sources/javascripts/chat.js')
    .bundle()
    .pipe(source('chat.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts'))
});

gulp.task('stylus', function () {
  return gulp.src('./public/stylesheets/style.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('default',['notificaciones', 'chat', 'stylus']);