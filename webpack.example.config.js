module.exports = {
  entry: './example/app.js',
  devtool: 'source-map',
  output: {
    path: './example/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel'
    }, {
      test: /\.html$/, exclude: /node_modules/, loader: 'raw'
    }]
  },
  devServer: {
    contentBase: 'example/',
    host: '0.0.0.0'
  }
};