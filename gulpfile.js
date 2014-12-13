var fs = require('fs');

var gulp = require('gulp');

var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var bump = require('gulp-bump');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var karma = require('karma').server;

var _outputDir = 'build';
var _htmlWatchPaths = ['src/**/*.html'];
var _jsAppWatchPaths = ['src/**/*.js'];
var _lessAppWatchPaths = ['src/**/*.less'];
var _tplAppWatchPaths = ['src/**/*.tpl.html'];

gulp.task('js', function() {
  gulp.src('src/hierarchical-selector.js')
  .pipe(gulp.dest(_outputDir))
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// compile LESS and lint css
gulp.task('less', function() {
  gulp.src('src/hierarchical-selector.less')
  .pipe(less({
    //paths: [ path.join(__dirname) ]
  }))
  .pipe(gulp.dest(_outputDir));
});

gulp.task('templates', function () {
  gulp.src('src/**/*.tpl.html')
  .pipe(templateCache('hierarchical-selector.templates.js', {module: 'hierarchical-selector'}))
  .pipe(gulp.dest(_outputDir));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// watch and rerun
gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// build the client for devleopment (watches and recompiles etc.)
gulp.task('build', ['js', 'less', 'templates']);

gulp.task('bump-minor', function(){
  gulp.src('./package.json')
    .pipe(bump({type:'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function(){
  gulp.src('./package.json')
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('min-css', function() {
  var version = JSON.parse(fs.readFileSync('./package.json').toString()).version;
  gulp.src(_outputDir + '/*.css')
    .pipe(minifyCSS())
    .pipe(rename('ng-hierarchical-selector.' + version + '.min.css'))
    .pipe(gulp.dest(_outputDir));
});

gulp.task('min', ['min-css'], function() {
  var version = JSON.parse(fs.readFileSync('./package.json').toString()).version;
  gulp.src(_outputDir + '/*.js')
    .pipe(concat(_outputDir + '/ng-hierarchical-celector.' + version + '.js'))
    .pipe(uglify())
    .pipe(rename('ng-hierarchical-selector.' + version + '.min.js'))
    .pipe(gulp.dest(_outputDir));
});

// Build the client and server
gulp.task('default', ['clean', 'build'])

// Build the client and server and start the server
gulp.task('watch', ['build'], function() {
  gulp.watch(_jsAppWatchPaths, ['js']);
  gulp.watch(_lessAppWatchPaths, ['less']);
  gulp.watch(_tplAppWatchPaths, ['templates']);
});

gulp.task('clean', function(cb) {
  del([_outputDir], cb);
});
