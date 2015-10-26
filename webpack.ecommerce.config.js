module.exports = {
  entry: './example/ecommerce/app.js',
  devtool: 'source-map',
  output: {
    path: './example/ecommerce/',
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
    contentBase: 'example/ecommerce/',
    host: '0.0.0.0',
    compress: true
  }
};

