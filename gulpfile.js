const path = require('path');
const resolve = function(filePath) {
  return path.join(__dirname, filePath);
};
const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const buildModernizr = require(resolve('gulp/utils/buildModernizr'));
const buildViewHtml = require(resolve('gulp/utils/buildViewHtml'));
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const fs = require('fs-extra');
const gulp = require('gulp');
const gulpPostcss = require('gulp-postcss');
const gutil = require('gulp-util');
const livereload = require('livereload');
const nunjucks = require('nunjucks');
const open = require('open');
const os = require('os');
const postcssColorRgbaFallback = require('postcss-color-rgba-fallback');
const postcssOpacity = require('postcss-opacity');
const Promise = require('bluebird');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webserver = require('gulp-webserver');

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

const gulpConfig = require(resolve('gulp/config'));

const webpackConfig = require('./webpack.config');

const livereloadOpen =
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
const {argv} = require('yargs').option('vw', {
  alias: 'view',
  default: 'IrisView',
  type: 'string'
});

/* -----------------------------------------------------------------------------
 * Misc
 ---------------------------------------------------------------------------- */

const flags = {
  livereloadInit: false // Whether `livereload-init` task has been run
};
let server;
let viewModules = [];

// Choose browser for node-open.
let browser = gulpConfig.webserver.browsers.default;
const platform = os.platform();
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
    runSequence(...tasks);
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
  const config = _.clone(gulpConfig.webserver);
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
  const livereloadTask = 'livereload-reload';
  const watchTasks = [
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
    const tasks = _.clone(watchConfig.tasks);
    tasks.push(livereloadTask);
    startWatch(watchConfig.files, tasks);
  });
});

// http://stackoverflow.com/a/30047862
const CssPlugin = function() {};
CssPlugin.prototype.apply = function(compiler) {
  const loader = path.resolve('./node_modules/babel-loader/lib/index.js');
  const loaderQuery = '?cacheDirectory!';
  const componentLoader =
    loader + loaderQuery + path.resolve(gulpConfig.src.components) + '/';
  const viewLoader =
    loader + loaderQuery + path.resolve(gulpConfig.src.views) + '/';

  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('after-optimize-chunk-assets', function(chunks) {
      const modules = chunks.reduce(function(result, chunk) {
        return result.concat(
          chunk.mapModules(function(module) {
            return module.request;
          })
        );
      }, []);

      const nextViewModules = _.uniq(
        modules
          .map(function(value) {
            /* eslint array-callback-return: 0 */
            /* eslint consistent-return: 0 */
            if (!value) {
              return;
            }

            if (~value.indexOf(componentLoader)) {
              const parts = value.substring(componentLoader.length).split('/');
              const dirname = _.first(parts);
              const extname = path.extname(_.last(parts));
              const basename = path.basename(_.last(parts), extname);

              return path.join(
                gulpConfig.src.components,
                dirname,
                'css',
                basename + '.scss'
              );
            }

            if (~value.indexOf(viewLoader)) {
              const viewName = value.substring(viewLoader.length).split('/')[0];

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
  const entryDir = path.join(gulpConfig.src.views, argv.view, 'js');
  const entryFile = argv.view + '.jsx';

  const config = _.assign(_.clone(webpackConfig), {
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

  const compiler = webpack(config);

  compiler.plugin('done', function(stats) {
    const {errors} = stats.toJson();

    if (errors && errors.length > 0) {
      return;
    }

    server.refresh(livereloadOpen);
  });

  new webpackDevServer(compiler, {
    hot: true,
    quiet: false,
    stats: {
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
    }
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
