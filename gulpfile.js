'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');

gulp.task('sass', () => {
  gulp.src('./sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./styles'));;
});

gulp.task('watch', () => {
  gulp.watch('./sass/*.scss', ['default']);
});

gulp.task('default', ['sass']);
