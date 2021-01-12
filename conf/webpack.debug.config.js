'use strict'

const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    libraryTarget: 'var',
    library: 'OrbitDBBundle',
    filename: '../dist/bundle.js'
  },
  target: 'web',
  devtool: 'source-map',
  externals: {
    fs: '{}',
    mkdirp: '{}'
  },
  node: {
    console: false,
    Buffer: true,
    mkdirp: 'empty',
    fs: 'empty'
  },
  plugins: [
  ],
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    alias: {
      leveldown: 'level-js'
    }
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    moduleExtensions: ['-loader']
  }
}
