function resolve(filePath) {
  return path.join(__dirname, filePath);
}

var path = require('path');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var buildModernizr = require(resolve('gulp/utils/buildModernizr'));
var buildViewHtml = require(resolve('gulp/utils/buildViewHtml'));
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var fs = require('fs-extra');
var gulp = require('gulp');
var gulpPostcss = require('gulp-postcss');
var gutil = require('gulp-util');
var livereload = require('livereload');
var nunjucks = require('nunjucks');
var open = require('open');
var os = require('os');
var postcssColorRgbaFallback = require('postcss-color-rgba-fallback');
var postcssOpacity = require('postcss-opacity');
var Promise = require('bluebird');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webserver = require('gulp-webserver');

Promise.promisifyAll(fs);

// https://github.com/petkaantonov/bluebird/issues/418#issuecomment-68279389
fs.existsAsync = Promise.promisify(function exists2(path, exists2callback) {
  fs.exists(path, function callbackWrapper(exists) {
    exists2callback(null, exists);
  });
});

/* -----------------------------------------------------------------------------
 * Config
 ---------------------------------------------------------------------------- */

var gulpConfig = require(resolve('gulp/config'));

var webpackConfig = require('./webpack.config');

var livereloadOpen =
  (gulpConfig.webserver.https ? 'https' : 'http') +
  '://' +
  gulpConfig.webserver.host +
  ':' +
  gulpConfig.webserver.port +
  (gulpConfig.webserver.open ? gulpConfig.webserver.open : '/');

nunjucks.configure({
  noCache: true
});

/* -----------------------------------------------------------------------------
 * Arguments
 ---------------------------------------------------------------------------- */

// Parses `view` argument.
var argv = require('yargs').option('vw', {
  alias: 'view',
  default: 'HelloWorldView',
  type: 'string'
}).argv;

/* -----------------------------------------------------------------------------
 * Misc
 ---------------------------------------------------------------------------- */

var flags = {
  livereloadInit: false // Whether `livereload-init` task has been run
};
var server;
var viewModules = [];

// Choose browser for node-open.
var browser = gulpConfig.webserver.browsers.default;
var platform = os.platform();
if (_.has(gulpConfig.webserver.browsers, platform)) {
  browser = gulpConfig.webserver.browsers[platform];
}

/* -----------------------------------------------------------------------------
 * Functions
 ---------------------------------------------------------------------------- */

/**
 *
 * @param   {string} src
 * @param   {string} dist
 * @returns {Promise}
 */
function buildCss(src, dist) {
  return new Promise(function(resolve, reject) {
    gulp
      .src(src)
      .pipe(sass(gulpConfig.css.params).on('error', sass.logError))
      .pipe(
        gulpPostcss([
          autoprefixer(gulpConfig.autoprefixer),
          postcssColorRgbaFallback,
          postcssOpacity
        ])
      )
      .pipe(concat('app.css'))
      .pipe(gulp.dest(dist))
      .pipe(
        cssmin({
          advanced: false
        })
      )
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(gulp.dest(dist))
      .on('end', function() {
        resolve();
      });
  });
}

/**
 * Start a watcher.
 *
 * @param {Array} files
 * @param {Array} tasks
 * @param {boolean} livereload - Set to `true` to force livereload to refresh the page.
 */
function startWatch(files, tasks, livereload) {
  if (livereload) {
    tasks.push('livereload-reload');
  }

  gulp.watch(files, function() {
    runSequence.apply(null, tasks);
  });
}

/* -----------------------------------------------------------------------------
 * Tasks
 ---------------------------------------------------------------------------- */

gulp.task('build-css', function() {
  return buildCss(
    [].concat([path.join(gulpConfig.src.css, '**/*.scss')], viewModules),
    gulpConfig.dist.css
  );
});

gulp.task('build-html', function() {
  return buildViewHtml(argv.view);
});

gulp.task('build-vendor', function() {
  return buildModernizr(gulpConfig.modernizr);
});

// Start the webserver.
gulp.task('webserver-init', function(cb) {
  var config = _.clone(gulpConfig.webserver);
  config.open = false;
  // config.middleware = require(resolve());

  gulp
    .src('./')
    .pipe(webserver(config))
    .on('end', cb);
});

// Start the LiveReload server.
gulp.task('livereload-init', function(cb) {
  if (!flags.livereloadInit) {
    flags.livereloadInit = true;
    server = livereload.createServer();
    open(livereloadOpen, browser);
  }
  cb();
});

// Refresh the page.
gulp.task('livereload-reload', function(cb) {
  server.refresh(livereloadOpen);
  cb();
});

gulp.task('watch:livereload', function() {
  var livereloadTask = 'livereload-reload';
  var watchTasks = [
    // CSS
    {
      files: [
        path.join(gulpConfig.src.css, '**/*.scss'),
        path.join(gulpConfig.src.components, '**/*.scss'),
        path.join(gulpConfig.src.views, '**/*.scss')
      ],
      tasks: ['build-css']
    },
    // HTML and data
    {
      files: [
        path.join(gulpConfig.src.views, argv.view, '*.njk'),
        path.join(gulpConfig.src.views, argv.view, 'data.js'),
        path.join(gulpConfig.src.views, argv.view, 'data/*.js')
      ],
      tasks: ['build-html']
    }
  ];

  _.forEach(watchTasks, function(watchConfig) {
    var tasks = _.clone(watchConfig.tasks);
    tasks.push(livereloadTask);
    startWatch(watchConfig.files, tasks);
  });
});

// http://stackoverflow.com/a/30047862
var CssPlugin = function() {};
CssPlugin.prototype.apply = function(compiler) {
  var loader = path.resolve('./node_modules/babel-loader/lib/index.js');
  var loaderQuery = '?cacheDirectory!';
  var componentLoader =
    loader + loaderQuery + path.resolve(gulpConfig.src.components) + '/';
  var viewLoader =
    loader + loaderQuery + path.resolve(gulpConfig.src.views) + '/';

  compiler.plugin('compilation', function(compilation, params) {
    compilation.plugin('after-optimize-chunk-assets', function(chunks) {
      var modules = chunks.reduce(function(result, chunk) {
        return result.concat(
          chunk.mapModules(function(module) {
            return module.request;
          })
        );
      }, []);

      var nextViewModules = _.uniq(
        modules
          .map(function(value) {
            if (!value) {
              return;
            }

            if (~value.indexOf(componentLoader)) {
              var parts = value.substring(componentLoader.length).split('/');
              var dirname = _.first(parts);
              var extname = path.extname(_.last(parts));
              var basename = path.basename(_.last(parts), extname);

              return path.join(
                gulpConfig.src.components,
                dirname,
                'css',
                basename + '.scss'
              );
            }

            if (~value.indexOf(viewLoader)) {
              var viewName = value.substring(viewLoader.length).split('/')[0];

              return path.join(
                gulpConfig.src.views,
                viewName,
                'css',
                viewName + '.scss'
              );
            }
          })
          .filter(function(value) {
            return !!value;
          })
      ).reverse();

      if (_.xor(nextViewModules, viewModules).length) {
        viewModules = _.clone(nextViewModules);

        buildCss(
          [].concat(
            [path.join(gulpConfig.src.css, '**/*.scss')],
            nextViewModules
          ),
          gulpConfig.dist.css
        ).then(function() {
          server.refresh(livereloadOpen);
        });
      }
    });
  });
};

gulp.task('webpack-dev-server', function(cb) {
  var entryDir = path.join(gulpConfig.src.views, argv.view, 'js');
  var entryFile = argv.view + '.jsx';

  var config = _.assign(_.clone(webpackConfig), {
    entry: {
      app: ['react-hot-loader/patch', './' + entryFile]
    },
    output: {
      filename: 'app.js',
      path: resolve(gulpConfig.dist.js)
    },
    context: resolve(entryDir)
  });

  config.plugins = (config.plugins || []).concat([new CssPlugin()]);

  var compiler = webpack(config);

  compiler.plugin('done', function(stats) {
    var errors = stats.toJson().errors;

    if (errors && errors.length > 0) {
      return;
    }

    gutil.log(
      '[webpack]',
      stats.toString({
        colors: gutil.colors.supportsColor,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
      })
    );

    server.refresh(livereloadOpen);
  });

  new webpackDevServer(compiler, {
    hot: true,
    quiet: true
  }).listen(8080, 'localhost', function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    cb();
  });
});

gulp.task('livereload', function() {
  runSequence(
    'build-html',
    'build-vendor',
    'webserver-init',
    'webpack-dev-server',
    'livereload-init',
    'watch:livereload'
  );
});

/* -----------------------------------------------------------------------------
 * Default task
 ---------------------------------------------------------------------------- */

gulp.task('default', ['livereload']);
