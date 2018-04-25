const path = require('path');
const webpack = require('webpack');
const {browserslist} = require('./package.json');

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
        loader: 'babel-loader?cacheDirectory',
        options: {
          babelrc: false,
          comments: false,
          env: {
            development: {
              plugins: [
                'transform-object-assign',
                ['transform-object-rest-spread', {useBuiltIns: false}],
                'transform-remove-strict-mode'
              ]
            },
            production: {
              plugins: [
                'transform-object-assign',
                ['transform-object-rest-spread', {useBuiltIns: false}],
                'transform-react-remove-prop-types',
                'transform-remove-strict-mode'
              ]
            }
          },
          presets: [
            [
              'env',
              {
                exclude: [
                  'transform-async-to-generator',
                  'transform-regenerator'
                ],
                loose: true,
                modules: 'commonjs',
                targets: {
                  browsers: browserslist
                },
                useBuiltIns: false
              }
            ],
            'stage-2',
            'react'
          ]
        }
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
