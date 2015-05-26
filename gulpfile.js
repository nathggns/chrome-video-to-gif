var gulp = require('gulp');
var crx = require('./gulp-crx');
var fs = require('fs');
var clean = require('gulp-clean');

gulp.task('crx-copy', function() {
	return gulp.src([
		'build/**/*.js',
		'manifest.json',
		'worker.js',
		'node_modules/videoconverter/build/ffmpeg.js',
		'popup.html',
		'node_modules/react/dist/react-with-addons.js',
		'node_modules/react/dist/JSXTransformer.js',
		'logo.png'
	], { base : './' })
		.pipe(gulp.dest('build-crx'))
});

gulp.task('crx-store', ['crx-copy'], function() {
	var manifest = JSON.parse(fs.readFileSync('build-crx/manifest.json'));
	delete manifest.update_url;
	fs.writeFileSync('build-crx/manifest.json', JSON.stringify(manifest));
});

gulp.task('crx-clean', ['crx-compile'], function() {
	return gulp.src(['build-crx'])
		.pipe(clean());
});

gulp.task('crx-compile', ['crx-copy'], function() {
	return gulp.src('./build-crx')
		.pipe(crx({
			privateKey : fs.readFileSync('../gif.pem', 'utf8'),
			filename : 'gif.crx'
		}))
		.pipe(gulp.dest('../'));
});

gulp.task('crx', ['crx-copy', 'crx-compile', 'crx-clean']);