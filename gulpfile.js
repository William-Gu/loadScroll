var gulp 		= require('gulp'),
    imagemin 	= require('gulp-imagemin'),
	sass        = require("gulp-sass"),
	filter      = require('gulp-filter'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');
    browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

gulp.task('imagemin', function () {
    gulp.src('src/imgs/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/imgs'));
});

// 静态服务器 + 监听 scss/html 文件
gulp.task('watch', ['sass'], function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch("src/*.scss", ['sass']);
    gulp.watch("*.html").on('change', reload);
});

gulp.task('sass', function () {
    return gulp.src('src/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({sourcemap: true}).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))// Write the CSS & Source maps
        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(reload({stream:true}));
});