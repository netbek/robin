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
        exclude: /node_modules\/(?!(react-redux-form))/, // Exclude dirs in node_modules except react-redux-form
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  },
  externals: {
    bluebird: 'Promise',
    jquery: 'jQuery',
    lodash: '_',
    moment: 'moment',
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
