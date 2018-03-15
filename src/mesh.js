let _ = require('underscore')
  , Poly = require('poly-overlap')
  , poly = new Poly()
  ;

const defaultBasePoint = {lat: 0, lng: 100};
const defaultInterval = {
  1: {x: (40 / 60),      y: 1},
  2: {x: (5 / 60),       y: (7.5 / 60)},
  3: {x: (30 / 60 / 60), y: (45 / 60 / 60)},
  4: {x: (3 / 60 / 60),  y: (4.5 / 60 / 60)},
};

module.exports = class GeoMesh {
  constructor(type, basePoint, interval) {
    this.basePoint = basePoint || defaultBasePoint;
    this.interval = (type === 'custom' ? interval : defaultInterval[String(type)]);
    Object.freeze(this.basePoint);
    Object.freeze(this.interval);
  }

  getMeshOffsetFromFitPoint(lat, lng) {
    let basePoint = this.basePoint
      , interval = this.interval
      , latDiff = (lat - basePoint.lat)
      , lngDiff = (lng - basePoint.lng)
      , offsetX = (latDiff / interval.x) << 0
      , offsetY = (lngDiff / interval.y) << 0
      ;

    return {
      x: offsetX,
      y: offsetY
    };
  }

  getRectCoordinatesFromMeshOffset(x, y) {
    let basePoint = this.basePoint
      , interval = this.interval
      ;

    return [
      // left bottom
      [basePoint.lat + (interval.x * x), basePoint.lng + (interval.y * y)],
      // left top
      [basePoint.lat + (interval.x * (x + 1)), basePoint.lng + (interval.y * y)],
      // right top
      [basePoint.lat + (interval.x * (x + 1)), basePoint.lng + (interval.y * (y + 1))],
      // right bottom
      [basePoint.lat + (interval.x * x), basePoint.lng + (interval.y * (y + 1))],
      // left bottom
      [basePoint.lat + (interval.x * x), basePoint.lng + (interval.y * y)],
    ];
  }

  getMeshOffsetsFromFitLine (coordinates) {
    let candidateMeshes = getRectMeshOffsetsFromCoordinates.call(this, coordinates)
      ;

    return _.chain(candidateMeshes)
      .filter(mesh => {
        let lines = coordinates.map((v, idx) => [v, coordinates[idx + 1]]).slice(0, -1)
        return lines.some(line => poly.overlap(this.getRectCoordinatesFromMeshOffset(mesh.x, mesh.y), line));
      })
      .value();
  }

  getMeshOffsetsFromFitPolygon(coordinates) {
    let rectOffsets = getRectMeshOffsetsFromCoordinates.call(this, coordinates)
      , lineOffsets
      , lineOffsetsKeyHash = {}
      , contains = []
      , maxX = - Infinity
      , maxY = - Infinity
      , minX = Infinity
      , minY = Infinity
      ;

    lineOffsets = _.chain(rectOffsets)
      .filter(mesh => {
        let lines = coordinates.map((v, idx) => [v, coordinates[idx + 1]]).slice(0, -1)
        return lines.some(line => poly.overlap(this.getRectCoordinatesFromMeshOffset(mesh.x, mesh.y), line));
      })
      .value();

    lineOffsets.forEach(offset => {
      minY = minY <= offset.y ? minY : offset.y;
      minX = minX <= offset.x ? minX : offset.x;
      maxY = maxY >= offset.y ? maxY : offset.y;
      maxX = maxX >= offset.x ? maxX : offset.x;
      // Create a flag to distinguish line boundaries
      lineOffsetsKeyHash[[offset.x, offset.y].join()] = true;
    })

    return rectOffsets.filter(offset => {
      let i, iz, isInner = true, isOR = false;
      // It is checked whether or not the extension in the top and bottom,
      // left and right intersects the boundary of the line segment.
      // That means that there is a mesh inside the boundary.

      // Is there a line segment boundary to the top?
      for (i = offset.y, iz = maxY; i <= iz; i++) {
        isOR = (isOR || lineOffsetsKeyHash[[offset.x, i].join()])
        if (isOR) { break; }
      }

      isInner = !!(isInner && isOR)
      isOR = false;

      // Is there a line segment boundary to the bottom?
      for (i = minY, iz = offset.y; i <= iz; i++) {
        isOR = (isOR || lineOffsetsKeyHash[[offset.x, i].join()])
        if (isOR) { break; }
      }
      isInner = !!(isInner && isOR)
      isOR = false;

      // Is there a line segment boundary to the right?
      for (i = offset.x, iz = maxX; i <= iz; i++) {
        isOR = (isOR || lineOffsetsKeyHash[[i, offset.y].join()])
        if (isOR) { break; }
      }

      isInner = !!(isInner && isOR)
      isOR = false;

      // Is there a line segment boundary to the left?
      for (i = minX, iz = offset.x; i <= iz; i++) {
        isOR = (isOR || lineOffsetsKeyHash[[i, offset.y].join()])
        if (isOR) { break; }
      }

      isInner = !!(isInner && isOR)
      isOR = false;

      return isInner;
    });
  }
}

function getRectMeshOffsetsFromCoordinates(coordinates) {
  let coord = _.first(coordinates)
    , candidateMeshes = []
    , lngMax = coord[1]
    , lngMin = coord[1]
    , latMax = coord[0]
    , latMin = coord[0]
    , lt
    , lb
    , rt
    , rb
    , i
    , iz
    , j
    , jz
    ;

  coordinates.slice(1).forEach(v => {
    let lat = v[0]
      , lng = v[1]
      ;
    if (lngMax < lng) {
      lngMax = lng;
    }
    if (latMax < lat) {
      latMax = lat;
    }
    if (lngMin > lng) {
      lngMin = lng;
    }
    if (latMin > lat) {
      latMin = lat;
    }
  });


  lb = this.getMeshOffsetFromFitPoint(latMin, lngMin);
  lt = this.getMeshOffsetFromFitPoint(latMax, lngMin);
  rb = this.getMeshOffsetFromFitPoint(latMin, lngMax);
  rt = this.getMeshOffsetFromFitPoint(latMax, lngMax);

  for (i = lb.x, iz = rt.x; i <= iz; i++) {
    for (j = lb.y, jz = rt.y; j <= jz; j++) {
      candidateMeshes.push({x: i, y: j})
    }
  }

  return candidateMeshes;
}
