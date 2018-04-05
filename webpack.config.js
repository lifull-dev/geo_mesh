module.exports = {
  entry: `${__dirname}/src/mesh.js`,
  output: {
    path: `${__dirname}/dist`,
    filename: 'geo_mesh.js',
    library: 'GeoMesh',
    libraryTarget: 'umd'
  }
}
