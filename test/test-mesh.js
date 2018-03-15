let assert = require('assert')
  ;

let GeoMesh = require('../src/mesh')
  ;

describe('about Geomesh', () => {
  let meguroStation = {lat: 35.633406, lng: 139.715622}
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
      [35.63581374810408, 139.71287727355957],
    ]
    ;

  describe('@getMeshOffsetFromFitPoint', () => {
    context('mesh-type 1', () => {
      it('shold Return Mesh offset containing Meguro Station', () => {
        let mesh = new GeoMesh(1)
          , offset = mesh.getMeshOffsetFromFitPoint(meguroStation.lat, meguroStation.lng)
          ;

        assert.deepEqual(offset, {x: 53, y: 39})
      })
    })

    context('mesh-type 2', () => {
      it('shold Return Mesh offset containing Meguro Station', () => {
        let mesh = new GeoMesh(2)
          , offset = mesh.getMeshOffsetFromFitPoint(meguroStation.lat, meguroStation.lng)
          ;

        assert.deepEqual(offset, {x: 427, y: 317})
      })
    })

    context('mesh-type 3', () => {
      it('shold Return Mesh offset containing Meguro Station', () => {
        let mesh = new GeoMesh(3)
          , offset = mesh.getMeshOffsetFromFitPoint(meguroStation.lat, meguroStation.lng)
          ;

        assert.deepEqual(offset, {x: 4276, y: 3177})
      })
    })

    context('mesh-type 4', () => {
      it('shold Return Mesh offset containing Meguro Station', () => {
        let mesh = new GeoMesh(4)
          , offset = mesh.getMeshOffsetFromFitPoint(meguroStation.lat, meguroStation.lng)
          ;

        assert.deepEqual(offset, {x: 42760, y: 31772})
      })
    })

    context('mesh-type custom', () => {
      it('shold Return Mesh offset containing Meguro Station', () => {
        let mesh = new GeoMesh('custom', null, {x: 20 / 60, y: 40 / 60})
          , offset = mesh.getMeshOffsetFromFitPoint(meguroStation.lat, meguroStation.lng)
          ;

        assert.deepEqual(offset, {x: 106, y: 59})
      })
    })

    context('modify base point', () => {
      it('shold Return Mesh offset containing Meguro Station', () => {
        let mesh = new GeoMesh(4, {lat: 0, lng: 0})
          , offset = mesh.getMeshOffsetFromFitPoint(meguroStation.lat, meguroStation.lng)
          ;

        assert.deepEqual(offset, {x: 42760, y: 111772})
      })
    })
  })

  describe('@getRectCoordinatesFromMeshOffset', () => {
    context('mesh-type 1', () => {
      it('shold Return Mesh coordinate', () => {
        let mesh = new GeoMesh(1)
          , rectCoords = mesh.getRectCoordinatesFromMeshOffset(53, 39)
          ;

        assert.deepEqual(rectCoords, [
          [ 35.33333333333333, 139 ],
          [ 36, 139 ],
          [ 36, 140 ],
          [ 35.33333333333333, 140 ],
          [ 35.33333333333333, 139 ]
        ])
      })
    })

    context('mesh-type 2', () => {
      it('shold Return Mesh coordinate', () => {
        let mesh = new GeoMesh(2)
          , rectCoords = mesh.getRectCoordinatesFromMeshOffset(427, 317)
          ;

        assert.deepEqual(rectCoords, [
          [35.58333333333333, 139.625],
          [35.666666666666664, 139.625],
          [35.666666666666664, 139.75],
          [35.58333333333333, 139.75],
          [35.58333333333333, 139.625]
        ])
      })
    })

    context('mesh-type 3', () => {
      it('shold Return Mesh coordinate', () => {
        let mesh = new GeoMesh(3)
          , rectCoords = mesh.getRectCoordinatesFromMeshOffset(4276, 3177)
          ;

        assert.deepEqual(rectCoords, [
          [35.63333333333333, 139.7125],
          [35.641666666666666, 139.7125],
          [35.641666666666666, 139.725],
          [35.63333333333333, 139.725],
          [35.63333333333333, 139.7125]
        ])
      })
    })

    context('mesh-type 4', () => {
      it('shold Return Mesh coordinate', () => {
        let mesh = new GeoMesh(4)
          , rectCoords = mesh.getRectCoordinatesFromMeshOffset(42760, 31772)
          ;

        assert.deepEqual(rectCoords, [
          [35.63333333333333, 139.715],
          [35.634166666666665, 139.715],
          [35.634166666666665, 139.71625],
          [35.63333333333333, 139.71625],
          [35.63333333333333, 139.715]
        ])
      })
    })

    context('mesh-type custom', () => {
      it('shold Return Mesh coordinate', () => {
        let mesh = new GeoMesh('custom', null, {x: 20 / 60, y: 40 / 60})
          , rectCoords = mesh.getRectCoordinatesFromMeshOffset(106, 59)
          ;

        assert.deepEqual(rectCoords, [
          [35.33333333333333, 139.33333333333331],
          [35.666666666666664, 139.33333333333331],
          [35.666666666666664, 140],
          [35.33333333333333, 140],
          [35.33333333333333, 139.33333333333331]
        ])
      })
    })

    context('modify base point', () => {
      it('shold Return Mesh coordinate', () => {
        let mesh = new GeoMesh(4, {lat: 0, lng: 0})
          , rectCoords = mesh.getRectCoordinatesFromMeshOffset(42760, 111772)
          ;

        assert.deepEqual(rectCoords, [
          [35.63333333333333, 139.715],
          [35.634166666666665, 139.715],
          [35.634166666666665, 139.71625],
          [35.63333333333333, 139.71625],
          [35.63333333333333, 139.715]
        ])
      })
    })
  })

  describe('@getMeshOffsetsFromFitLine', () => {
    it('shold Return Mesh offsets', () => {
      let mesh = new GeoMesh(4)
        , offsets = mesh.getMeshOffsetsFromFitLine(line)
        ;

      assert.deepEqual(offsets, [
        {x: 42756, y: 31772},
        {x: 42757, y: 31768},
        {x: 42757, y: 31769},
        {x: 42757, y: 31770},
        {x: 42757, y: 31771},
        {x: 42757, y: 31772},
        {x: 42757, y: 31773},
        {x: 42758, y: 31765},
        {x: 42758, y: 31766},
        {x: 42758, y: 31767},
        {x: 42758, y: 31768},
        {x: 42758, y: 31773},
        {x: 42759, y: 31763},
        {x: 42759, y: 31764},
        {x: 42759, y: 31765},
        {x: 42759, y: 31773},
        {x: 42760, y: 31773},
        {x: 42761, y: 31773},
        {x: 42762, y: 31770},
        {x: 42762, y: 31771},
        {x: 42762, y: 31772},
        {x: 42762, y: 31773},
      ])
    })
  })

  describe('@getMeshOffsetsFromFitPolygon', () => {
    it('shold Return Mesh offsets', () => {
      let mesh = new GeoMesh(4)
        , offsets = mesh.getMeshOffsetsFromFitPolygon(line)
        ;

      assert.deepEqual(offsets, [
        {x: 42756, y: 31772},
        {x: 42757, y: 31768},
        {x: 42757, y: 31769},
        {x: 42757, y: 31770},
        {x: 42757, y: 31771},
        {x: 42757, y: 31772},
        {x: 42757, y: 31773},
        {x: 42758, y: 31765},
        {x: 42758, y: 31766},
        {x: 42758, y: 31767},
        {x: 42758, y: 31768},
        {x: 42758, y: 31770},
        {x: 42758, y: 31771},
        {x: 42758, y: 31772},
        {x: 42758, y: 31773},
        {x: 42759, y: 31763},
        {x: 42759, y: 31764},
        {x: 42759, y: 31765},
        {x: 42759, y: 31770},
        {x: 42759, y: 31771},
        {x: 42759, y: 31772},
        {x: 42759, y: 31773},
        {x: 42760, y: 31773},
        {x: 42761, y: 31773},
        {x: 42762, y: 31770},
        {x: 42762, y: 31771},
        {x: 42762, y: 31772},
        {x: 42762, y: 31773},
      ])
    })
  })
})
