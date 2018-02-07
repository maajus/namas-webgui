"use strict";

process.env.NODE_ENV = 'production'

var debug = false;
const
webpack = require("gulp-webpack"),
    gulp = require("gulp"),
    babel = require("gulp-babel"),
    sass = require("gulp-sass"),
    //browserSync = require('browser-sync').create(),
    gp_rename = require('gulp-rename'),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify'),
    envify = require('gulp-envify'),
    gp_clean = require('gulp-clean'),
    pump = require('pump');

gulp.task('clean', function () {
    return gulp.src(['dist/www/js/*', '!dist/www/js/site.js'])
        .pipe(gp_clean({force: true}))
        .pipe(gulp.dest('dist'));
});


gulp.task("sass", function() {
	return gulp.src("src/www/css/site.scss")
		.pipe(sass())
		.on("error", function() {
			console.dir(arguments);
		})
		.pipe(gulp.dest("dist/www/css"));
});

gulp.task("babel", function() {

	return gulp.src(["src/www/js/**/*.jsx","src/www/js/**/*.js"])
		.pipe(babel({
			plugins: ["transform-react-jsx","react-html-attrs","transform-class-properties", "transform-decorators-legacy"],
			presets: ["es2015", "react", "stage-0"]
		}))
		.on("error", function() {
			console.dir(arguments);
		})
		.pipe(gulp.dest("dist/www/js"));

});

gulp.task("webpack", ["babel"], function() {

    return gulp.src("./dist/www/js/site.js")

        //.pipe(webpack({
            //module: {
                //loaders: [
                    //{ test: /\.css$/, loader: 'style!css' },
                //],
            //},
            //output: {
                //filename: "site.js"
            //}
        //}))

        .pipe(webpack( require('./webpack.config.js') ))
        .on("error", function() {
            console.dir(arguments);
        })

       .pipe(envify('production'))
       .pipe(gulp.dest("./dist/www/js"));


});

gulp.task('compress', function(){
    return gulp.src("./dist/www/js/site.js")
        .pipe(gp_concat('concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename("./www/js/site.js"))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));

});

gulp.task("copy", function() {

	gulp.src("node_modules/bootstrap/dist/css/**/*")
		.pipe(gulp.dest("dist/www/css"));

	gulp.src("src/www/**/*.html")
		.pipe(gulp.dest("dist/www"));

	gulp.src("src/www/css/*")
		.pipe(gulp.dest("dist/www/css"));

	gulp.src("src/www/images/*")
		.pipe(gulp.dest("dist/www/images"));

	gulp.src("src/www/fonts/*")
		.pipe(gulp.dest("dist/www/fonts"));



	//gulp.src(["src/**/*","!src/www/**/*"])
		//.pipe(gulp.dest("dist"));

});

gulp.task("server", function() {
	require("./index.js");
});


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/www"
        }
    });
});

gulp.task("default", ["sass", "webpack", "copy"] , function () {

	gulp.watch("src/www/css/site.scss", ["sass"]);
	gulp.watch(["src/www/js/**/*.jsx","src/www/js/**/*.js"], ["webpack"]);
	gulp.watch(["node_modules/bootstrap/dist/css/**/*"], ["copy"]);
	gulp.watch(["src/www/**/*.html"], ["copy"]);
	gulp.watch(["src/**/*","!src/www/**/*"], ["copy"]);

});


gulp.task("product", ["sass", "webpack", "copy"] , function () {

    //gulp.start('clean');
    //gulp.start('compress');

});
