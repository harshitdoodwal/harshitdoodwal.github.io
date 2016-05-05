var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');

gulp.task('imagesRoot', function() {
  return gulp.src(['src/*.png','src/*.ico'], {base: 'src/'})
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist'));
});

//process sass
gulp.task('sass', function ()
{
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/css'));
});
//copy fonts into relevant directories
gulp.task('copyFonts', function ()
{
	return gulp.src([
			'src/fonts/*.eot',
			'src/fonts/*.svg',
			'src/fonts/*.ttf',
			'src/fonts/*.woff'
		])
		.pipe(gulp.dest('dist/fonts'));
});
gulp.task('copyROOT', function ()
{
	return gulp.src([
			'src/*.php',
			'src/*.png',
			'src/*.ico'
		])
		.pipe(gulp.dest('dist'));
});
// minify css to dist
gulp.task('minifyCss', function ()
{
	return gulp.src('src/css/*.css')
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'));
});
// minify js to dist
gulp.task('minifyJs', function ()
{
	return gulp.src('src/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});
//run css tasks
gulp.task('run-css', function() {
  runSequence(['sass', 'minifyCss']);
});
// copy folders that are relevant
var folders = ['dbconnect', 'emoji', 'fetchscripts', 'helper', 'imagescripts', 'mailer', 'postscripts', 'script', 'security', 'templates', 'tracker', 'vendor', 'verification,img'];
// copy folders to dist recursively
gulp.task('copyFolders', function ()
{
	return folders.forEach(function (folder)
	{
		return gulp.src(['src/' + folder + '/**/*'])
			.pipe(gulp.dest('dist/' + folder));
	});
});
// generate distributable folder
gulp.task('watch', function ()
{
	gulp.watch('src/**/*.php', ['copyFolders','copyROOT','imagesRoot']);
  gulp.watch('src/**/*.js', ['minifyJs']);
  gulp.watch('src/**/*.scss', ['run-css','copyFonts']);
});
