const os = require('os'),
  gulp = require('gulp'),
  webpack = require('webpack-stream'),
  browser_sync = require('browser-sync').create(),
  preprocess = require('gulp-preprocess'),
  gif = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  jshint = require('gulp-jshint'),
  htmlmin = require('gulp-htmlmin'),
  cleanCss = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  fse = require('fs-extra'),
  replace = require('gulp-replace'),
  sass = require('gulp-sass'),
  babel = require('gulp-babel'),
  prompt = require('gulp-prompt'),
  autoprefixer = require('gulp-autoprefixer'),
  cache = require('gulp-cache'),
  argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('jshint', 'hint the js')
  .command('new', 'new op project boilerplate')
  .command('demo', 'build for demo')
  .command('dev', 'build for development')
  .command('rls', 'build for release')
  .command('dep', 'copy rls to  for deployment')
  .example('$0 jshint -p mgm4', 'hint the js in mgm4')
  .example('$0 new -p mgm4ever', 'create new op project \'mgm4ever\'')
  .example('$0 demo -p mgm4', 'demo mgm4')
  .example('$0 dev -p mgm4', 'dev mgm4')
  .example('$0 rls -p \'mgm3 mgm4\' -e sit', 'rls both mgm4 and mgm3 for SIT')
  .example('$0 dep -p \'mgm3 mgm4\' -e prod', 'rls and deploy both mgm4 and mgm3 for PRODUCTION')
  .demand(['p'])
  .describe('p', 'projects')
  .alias('p', 'project')
  .describe('e', 'env')
  .alias('e', 'env')
  .choices('e', ['dev', 'demo', 'sit', 'prod'])
  .default('e', 'dev')
  .help('h')
  .alias('h', 'help')
  .argv;

// setup yours
var res_repo = '/Users/haiyansong/project/res';

var opts = {
  env: 'dev',
  src: './src',
  dist: {
    dev: {
      www: './dist/www',
      cdn: './dist/cdn',
      mta: {
        sid: '500132489',
        cid: '500132490'
      }
    },
    demo: {
      www: './dist/www',
      cdn: './dist/cdn',
      mta: {
        sid: '500132489',
        cid: '500132490'
      }
    },
    sit: {
      www: './rls/sit/www',
      cdn: './rls/sit/cdn',
      mta: {
        sid: '500132489',
        cid: '500132490'
      }
    },
    prod: {
      www: './rls/prod/www',
      cdn: './rls/prod/cdn',
      mta: {
        sid: '500129955',
        cid: '500129956'
      }
    }
  },
  boilerplate: './boilerplate',
  cdn_prefix: {
    dev: 'http://localhost:3000',
    demo: 'http://localhost:3000',
    sit: 'http://localhost:3000',
    prod: 'http://localhost:3000'
  },
  ip: 'localhost',
  activity: {
    id: -1,
    expired: ''
  }
};

// cache.fileCache = new cache.Cache({ cacheDirName: './gulp-cache' })

const getWiFiIP = () => {
  const en1 = os.networkInterfaces().en1
  if (!en1 || !en1.length) {
    return '127.0.0.1'
  } else {
    return en1.filter(details => details.family === 'IPv4' && details.internal === false)[0].address
  }
};

// init
gulp.task('init', function() {
  console.log('init'
  );
  // p for project
  if (argv.p) {
    opts.projects = argv.p.split(' ');
    if (opts.projects.length === 1) {
      opts.projects_path = opts.projects;
    } else {
      opts.projects_path = '{' + opts.projects.join(',') + '}';
    }
  }
  // e for env
  if (argv.e) {
    opts.env = argv.e;
  }

  opts.ip = getWiFiIP()
  console.log(`!!! You'd better to switch to Ceshi-WiFi first, Your current IP : ${opts.ip} !!!\n`)
  opts.cdn_prefix.dev = `http://${opts.ip}:3000`
});

// jshint
gulp.task('jshint', ['init'], function() {
  return gulp.src(opts.src + '/' + opts.projects_path + '/js/*.js')
    .pipe(jshint({
      lookup: true
    }))
    .pipe(jshint.reporter('default'));
});

// clean
gulp.task('clean', ['init'], function(cb) {
  if (opts.env === 'dev' || opts.env === 'demo') {
    fse.removeSync(opts.dist[opts.env].cdn);
    fse.removeSync(opts.dist[opts.env].www);
  } else {
    fse.removeSync(opts.dist[opts.env].cdn + '/assets');
    fse.removeSync(opts.dist[opts.env].cdn + '/' + opts.projects_path);
    fse.removeSync(opts.dist[opts.env].www + '/' + opts.projects_path);
  }
  cb();
});

// clear cache
gulp.task('clear-cache', function () {
  return cache.clearAll();
});

// assets
gulp.task('assets', function() {
  return gulp.src(opts.src + '/' + opts.projects_path + '/assets/**/*', {
      base: opts.src
    })
    .pipe(gulp.dest(opts.dist[opts.env].cdn));
});

// img
gulp.task('img', function() {
  return gulp.src([opts.src + '/' + opts.projects_path + '/img/**/*.{png,jpg,jpeg,gif,ico}', opts.src + '/assets/img/**/*.{png,jpg,jpeg,gif,ico}'], {
      base: opts.src
    })
    .pipe(cache( imagemin({use: [ pngquant({quality: '95-100'}) ]}) ))
    .pipe(gulp.dest(opts.dist[opts.env].cdn));
});

// sass
gulp.task('sass', function() {
  return gulp.src([opts.src + '/' + opts.projects_path + '/css/*.scss', opts.src + '/assets/css/*.scss'], {
      base: opts.src
    })
    .pipe(sass().on('error', sass.logError))
    //.pipe(autoprefixer({ browsers: ['Android >= 4.1', 'iOS >= 7.1'] }))
    .pipe(gulp.dest(opts.src));
});

// css
gulp.task('css', ['assets', 'img', 'sass'], function() {
  return gulp.src([opts.src + '/' + opts.projects_path + '/css/*.css', opts.src + '/assets/css/*.css'], {
      base: opts.src
    })
    .pipe(preprocess({
      context: {
        ENV: opts.env,
        CDN_PREFIX: opts.cdn_prefix[opts.env],
        MTA_SID: opts.dist[opts.env].mta.sid,
        MTA_CID: opts.dist[opts.env].mta.cid
      }
    }))
    .pipe(autoprefixer({ browsers: ['Android >= 4.1', 'iOS >= 7.1'] }))
    .pipe(sourcemaps.init())
    .pipe(cleanCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(opts.dist[opts.env].cdn));
});

// js
gulp.task('js:lib', function() {
  return gulp.src(opts.src + '/assets/lib/**/*.js', {
      base: opts.src
    })
    .pipe(gulp.dest(opts.dist[opts.env].cdn));
});
gulp.task('js:assets', function() {
  return gulp.src(opts.src + '/assets/js/*.js', {
      base: opts.src
    })
    .pipe(preprocess({
      context: {
        IP: opts.ip
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(opts.dist[opts.env].cdn));
});
gulp.task('js:app', function() {
  if (argv.webpack) {
    return gulp.src(opts.src + '/' + opts.projects_path + '/js/entry.js', {
        base: opts.src
      })
      .pipe(webpack({
        output: {
          filename: opts.projects_path + '/js/bundle.js'
        },
        module: {
          loaders: [{
            test: /\.html$/,
            loader: 'html'
          }, {
            test: /\.(png|jpg)$/,
            loader: 'url'
          }]
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(opts.dist[opts.env].cdn));
  } else {
    return gulp.src(opts.src + '/' + opts.projects_path + '/js/*.js', {
        base: opts.src
      })
      .pipe(preprocess({
        context: {
          ENV: opts.env,
          CDN_PREFIX: opts.cdn_prefix[opts.env],
          IP: opts.ip
        }
      }))
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(opts.dist[opts.env].cdn));
  }
});

gulp.task('js', ['js:lib', 'js:assets', 'js:app']);

// html
gulp.task('html', ['css', 'js'], function() {
  return gulp.src([opts.src + '/' + opts.projects_path + '/*.html', '!' + opts.src + '/' + opts.projects_path + '/demo/*.html'], {
      base: opts.src
    })
    .pipe(preprocess({
      context: {
        ENV: opts.env,
        CDN_PREFIX: opts.cdn_prefix[opts.env],
        MTA_SID: opts.dist[opts.env].mta.sid,
        MTA_CID: opts.dist[opts.env].mta.cid
      }
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(opts.dist[opts.env].www));
});

// rls
gulp.task('rls', ['clean', 'html']);

// dev
gulp.task('dev:reload', ['html'], function() {
  browser_sync.reload();
});
gulp.task('dev', ['rls'], function() {
  browser_sync.init({
    server: [opts.dist[opts.env].www, opts.dist[opts.env].cdn],
    open: false,
    reloadOnRestart: true
  });
  gulp.watch(opts.src + '/**/*.{png,jpg,gif,ico,html,js,css,scss}', ['dev:reload']);
  });

// demo
gulp.task('html:demo', ['css', 'js:lib', 'js:app'], function() {
  return gulp.src(opts.src + '/' + opts.projects_path + '/demo/*.html')
    .pipe(gif(opts.env !== 'demo', preprocess({
      context: {
        CDN_PREFIX: opts.cdn_prefix[opts.env]
      }
    })))
    .pipe(gif(opts.env === 'demo', preprocess({
      context: {
        CDN_PREFIX: opts.cdn_prefix[opts.env] + '/' + opts.projects + '/cdn'
      }
    })))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(opts.dist[opts.env].www));
});
gulp.task('demo:reload', ['html:demo'], function() {
  browser_sync.reload();
});
gulp.task('demo', ['clean', 'html:demo'], function() {
  browser_sync.init({
    server: [opts.dist[opts.env].www, opts.dist[opts.env].cdn],
    open: true,
    reloadOnRestart: true
  });
  gulp.watch(opts.src + '/**/*.{png,jpg,gif,ico,html,css}', ['demo:reload']);

});

// deploy
gulp.task('dep:demo', ['clean', 'html:demo'], function() {
  });
gulp.task('res', ['rls'], function() {
  // clean
  fse.removeSync(res_repo);
  // cdn
  fse.copySync(opts.dist[opts.env].cdn, res_repo);
  // www
  fse.copySync(opts.dist[opts.env].www, res_repo);
});

// boilerplate
gulp.task('new:img', ['init'], function() {
  return gulp.src(opts.boilerplate + '/img/*')
    .pipe(gulp.dest(opts.src + '/' + opts.projects + '/img'))
    .pipe(prompt.prompt([{
      type: 'input',
      name: 'activity_id',
      message: 'activity_id :',
    }, {
      type: 'input',
      name: 'activity_prod_code',
      message: 'activity_prod_code to jump :',
    }, {
      type: 'input',
      name: 'activity_started',
      message: 'activity_started (format 2017-10-01 18:00:00, default empty. leave it empty to config in OP-ADM) :',
    }, {
      type: 'input',
      name: 'activity_expired',
      message: 'activity_expired (format 2017-10-01 18:00:00, default empty. leave it empty to config in OP-ADM) :',
    }], function(res) {
      opts.activity.id = res.activity_id
      opts.activity.prod_code = res.activity_prod_code
      opts.activity.started = res.activity_started
      opts.activity.expired = res.activity_expired
    }));
});
gulp.task('new', ['new:img'], function() {
  return gulp.src([opts.boilerplate + '/**/*', '!' + opts.boilerplate + '/img/*'])
    .pipe(replace('__PROJECT__', opts.projects))
    .pipe(replace('__ACTIVITY_ID__', opts.activity.id))
    .pipe(replace('__ACTIVITY_STARTED__', opts.activity.started))
    .pipe(replace('__ACTIVITY_EXPIRED__', opts.activity.expired))
    .pipe(replace('__ACTIVITY_PROD_CODE__', opts.activity.prod_code))
    .pipe(gulp.dest(opts.src + '/' + opts.projects));
});

