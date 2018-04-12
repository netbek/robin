var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['react-hot-loader/patch', './RobinExampleView.jsx']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/app/js')
  },
  context: path.resolve(__dirname, 'src/views/RobinExampleView/js'),
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules/', 'src/js/', 'src/components/', 'src/views/']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // We intentionally transpile everything except modules that meet the
        // following criteria: 1) the module breaks transpilation 2) the module
        // has ES5 compatible code. This defensive approach ensures that we have
        // ES5 output. The list could be extended in order to reduce build time.
        exclude: [
          './node_modules/@vx/annotation',
          './node_modules/@vx/axis',
          './node_modules/@vx/bounds',
          './node_modules/@vx/boxplot',
          './node_modules/@vx/brush',
          './node_modules/@vx/clip-path',
          './node_modules/@vx/curve',
          './node_modules/@vx/demo',
          './node_modules/@vx/drag',
          './node_modules/@vx/event',
          './node_modules/@vx/geo',
          './node_modules/@vx/glyph',
          './node_modules/@vx/gradient',
          './node_modules/@vx/grid',
          './node_modules/@vx/group',
          './node_modules/@vx/heatmap',
          './node_modules/@vx/hierarchy',
          './node_modules/@vx/legend',
          './node_modules/@vx/marker',
          './node_modules/@vx/mock-data',
          './node_modules/@vx/network',
          './node_modules/@vx/pattern',
          './node_modules/@vx/point',
          './node_modules/@vx/responsive',
          './node_modules/@vx/scale',
          './node_modules/@vx/shape',
          './node_modules/@vx/text',
          './node_modules/@vx/tooltip',
          './node_modules/@vx/voronoi',
          './node_modules/@vx/vx',
          './node_modules/@vx/zoom'
        ].map(d => path.resolve(d)),
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  },
  externals: {
    bluebird: 'Promise',
    jquery: 'jQuery',
    lodash: '_',
    moment: 'moment',
    papaparse: 'Papa',
    react: 'React',
    'react-addons-transition-group': 'React.addons.TransitionGroup',
    'react-addons-update': 'React.addons.update',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    redux: 'Redux',
    'redux-thunk': 'ReduxThunk',
    'velocity-animate': 'Velocity'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
