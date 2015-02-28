var gulp = require('gulp'),
	sass = require('gulp-sass');

gulp.task('sass', function() {
	gulp.src('./sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./styles'));;
});

gulp.task('watch', function() {
	gulp.watch('./sass/*.scss', ['default']);
});

gulp.task('default', ['sass']);