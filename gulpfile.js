const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');
const minimist = require('minimist'); // 用來讀取指令轉成變數

// env process
// production || development
// # gulp --env production
const envOptions = {
  string: 'env',
  default: { env: 'development' },
};

var options = minimist(process.argv.slice(2), envOptions);
console.log(options);
// --- env process

// load browser-sync
gulp.task('browserSync', () => {
  browserSync.init({
    server: { baseDir: './public' },
    reloadDebounce: 2000,
  });
});

// copy file to public (not include sass,ejs and html)
gulp.task('copy', () => {
  gulp
    .src(['./source/**/**', '!source/sass/**/**', '!source/**/*.ejs', '!source/**/*.html'])
    .pipe(gulp.dest('./public/'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

// sass process
gulp.task('sass', () => {
  // PostCSS AutoPrefixer
  const processors = [
    autoprefixer({
      browsers: ['last 5 version'],
    }),
  ];

  return gulp
    .src(['./source/sass/**/*.sass', './source/sass/**/*.scss'])
    .pipe($.wait(200))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: 'nested',
        includePaths: ['./node_modules/susy/sass'],		// addition include sass
      }).on('error', $.sass.logError),
    )
    .pipe($.postcss(processors))
    .pipe($.if(options.env === 'production', $.cleanCss())) // 假設開發環境則壓縮 CSS
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

// clear pubic file 
gulp.task('clean', () => {
  return gulp.src(['./public'], { read: false }).pipe($.clean());
});

//.src(['./source/**/*.ejs', './source/**/*.html'])
// layout process
gulp.task('layout', () => {
  return gulp
    .src(['./source/**/*.html'])
    .pipe($.plumber())
    .pipe($.frontMatter())  // 模板設置
    .pipe(
      $.layout((file) => {  // ejs 模板設置
        return file.frontMatter;
      }),
    )
    .pipe(gulp.dest('./public'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

// watch process
gulp.task('watch', () => {
  //gulp.watch(['./source/**/**', '!source/sass/**/**', '!source/**/*.ejs', '!source/**/*.html'], ['copy']);
  gulp.watch(['./source/**/**', '!source/sass/**/*.sass', '!source/sass/**/*.scss', '!source/**/*.ejs', '!source/**/*.html'], ['copy']);
  gulp.watch(['./source/**/*.ejs', './source/**/*.html'], ['layout']);
  gulp.watch(['./source/sass/**/*.sass', './source/sass/**/*.scss'], ['sass']);
});


gulp.task('ghpage', () => {
  return gulp.src('./public/**/*').pipe($.ghPages());
});

gulp.task('default', ['copy', 'sass', 'layout', 'browserSync', 'watch']);

// gulp.task('default', ['copy', 'sass', 'vendorJs', 'browserSync', 'layout', 'watch']);

