var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: [
    "webpack-dev-server/client?http://0.0.0.0:8080",
    'webpack/hot/dev-server',
    './examples/index'
  ],
  devServer: {
    contentBase: './examples/',
    hot: true
  },
  devtool: "source-map",
  debug: true,
  output: {
    path: path.join(__dirname, 'examples'),
    filename: 'bundle.js',
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/un~$/)
  ],
  resolve: {
    extensions: ['', '.js', '.cjsx', '.coffee']
  },
  module: {
    loaders: [
      { test: /\.css$/, loaders: ['style', 'css']},
      { test: /\.cjsx$/, loaders: ['react-hot', 'coffee', 'cjsx']},
      { test: /\.coffee$/, loader: 'coffee' }
    ]
  }
};
