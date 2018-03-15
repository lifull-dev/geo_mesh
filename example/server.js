let fs = require('fs')
  , path = require('path')
  , http = require('http')
  , pug = require('pug')
  ;

let GeoMesh = require('./../src/mesh')
  , GoogleAPIKey = process.env.GEOMESH_GOOGLE_APIKEY
  , view = path.resolve(__dirname, 'view.jade')
  , server = http.createServer()
  , center = {lat: 35.633406, lng: 139.715622}
  , line = [
    [35.63581374810408, 139.71287727355957],
    [35.635726550864504, 139.71658945083618],
    [35.63199441984387, 139.71680402755737],
    [35.63080847256858, 139.71513032913208],
    [35.63326754954175, 139.70397233963013]
  ]
  , polygon = [
    [35.63581374810408, 139.71287727355957],
    [35.635726550864504, 139.71658945083618],
    [35.63199441984387, 139.71680402755737],
    [35.63080847256858, 139.71513032913208],
    [35.63326754954175, 139.70397233963013],
    [35.63581374810408, 139.71287727355957]
  ]
  , port = 3333
  ;

function generateMesh(type, basePoint, interval) {
  let mesh = new GeoMesh(type, basePoint, interval)
    , tileOffset = mesh.getMeshOffsetFromFitPoint(center.lat, center.lng)
    ;
  return mesh.getRectCoordinatesFromMeshOffset(tileOffset.x, tileOffset.y).map(v => ({lat: v[0], lng: v[1]}))
}

function generateMeshFromLine(coordinates, type, basePoint, interval) {
  let mesh = new GeoMesh(type, basePoint, interval)
    , tileOffsets = mesh.getMeshOffsetsFromFitLine(coordinates)
    ;

  return tileOffsets.map(tileOffset => mesh.getRectCoordinatesFromMeshOffset(tileOffset.x, tileOffset.y).map(v => ({lat: v[0], lng: v[1]})))
}

function generateMeshFromPolygon(coordinates, type, basePoint, interval) {
  let mesh = new GeoMesh(type, basePoint, interval)
    , tileOffsets = mesh.getMeshOffsetsFromFitPolygon(coordinates)
    ;

  return tileOffsets.map(tileOffset => mesh.getRectCoordinatesFromMeshOffset(tileOffset.x, tileOffset.y).map(v => ({lat: v[0], lng: v[1]})))
}

let mesh = {
  1: {mesh: [generateMesh(1)]},
  2: {mesh: [generateMesh(2)]},
  3: {mesh: [generateMesh(3)]},
  4: {mesh: [generateMesh(4)]},
  custom: {mesh: [generateMesh('custom', null, {x: 30 / 60 / 60, y: 40 / 60 / 60})]},
  basepoint: {mesh: [generateMesh(3, {lat: 1, lng: 120})]},
  fitline: {mesh: [generateMeshFromLine(line, 4)], line: line.map(v => ({lat: v[0], lng: v[1]}))},
  fitpolygon: {mesh: [generateMeshFromPolygon(polygon, 4)], line: polygon.map(v => ({lat: v[0], lng: v[1]}))}
}

server.on('request', function(req, res) {
  let template = fs.readFileSync(view, 'utf-8')
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.write(pug.render(template, {api_key: GoogleAPIKey, mesh: mesh}));
  res.end();
});

server.listen(port, () => {
  console.log(`see http://localhost:${port}`)
});
