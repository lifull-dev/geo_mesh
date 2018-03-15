# Geo Mesh

## Mesh type and details

| mesh type | base point (lng, lat) | lat interval | lng interval | one length|
|---|---|---|---|---|
| 1 | 100,0 | 0.666666... | 1       | about 80km |
| 2 | 100,0 | 0.083333... | 0.125   | about 10km |
| 3 | 100,0 | 0.008333... | 0.0125  | about 1km  |
| 4 | 100,0 | 0.000833... | 0.00125 | about 100m |
| custom | 100,0 | -      | -       | -          |

## General open data and its base point

| open data name | base point (lng, lat) |
|---|---|
|[国土数値情報](http://nlftp.mlit.go.jp/ksj/old/old_data_mesh.html)|100, 0|


## How To Use

1. install this module

```sh
npm install geo_mesh
```

2. require this module and initialize

```js
let GeoMesh = require('geo_mesh')
  , geoMesh = new GeoMesh(3)
  ;
```

3. call some api

````
let tileOffset = geoMesh.getMeshOffsetFromFitPoint(lat, lng);
let meshCoordinates = geoMesh.getRectCoordinatesFromMeshOffset(tileOffset.x, tileOffset.y);
console.log(meshCoordinates);
```

## API List

* @constructor(type, basePoint, interval)
  * @args {String} type [1, 2, 3, 4, custom] --- mesh type
  * @args {Object} basePoint {lat: x, lng: y} --- starting point of the tile
  * @args {Object} interval {x: x, y: y} --- interval between latitude and longitude (only use custom)
  * @return {GeoMesh Instance}

* @getMeshOffsetFromFitPoint(lat, lng)
  * @args {Number} lat
  * @args {Number} lng
  * @return {MeshOffset}
    * @config {Number} x
    * @config {Number} y

Return the mesh containing the given coordinates.

* @getRectCoordinatesFromMeshOffset(offsetX, offsetY)
  * @args {Number} offsetX --- mesh offset X
  * @args {Number} offsetY --- mesh offset Y
  * @return {Array.<{lat: Number, lng: Number}, ...>}

Get the mesh coordinates from mesh offset.

* @getMeshOffsetsFromFitLine(coordinates)
  * @args {Array.<{lat: Number, lng: Number}>} coordinates --- line coordinates
  * @return {Array.<x: Number, y: Number>}

Get all the mesh coordinates containing the linestring.


* @getMeshOffsetsFromFitPolygon(coordinates)
  * @args {Array.<{lat: Number, lng: Number}>} coordinates --- polygon coordinates
  * @return {Array.<x: Number, y: Number>}

Get all the mesh coordinates containing the polygon.

## Example

run below. then open `http://localhost:3333`

```sh
export GEOMESH_GOOGLE_APIKEY=${google maps api key}
npm run example
```
