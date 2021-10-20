'use strict';

const {src, dest, watch, parallel, series } = require('gulp');

const scss  = require('gulp-sass')(require('sass'));
const concat = require('gulp-continuous-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
};

function cleanDist() {
    return del('dist')
}

function scripts() {
    return src('app/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
};

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
};

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.js',
        'app/*.html',
        'app/images/**/*'
    ], {base: 'app'})
    .pipe(dest('dist'))

};

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
};

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, build);
exports.default = parallel(styles, scripts, browsersync, watching);
