import _ from 'lodash';
import {
  //  GeometryFunction,
  SketchCoordType,
  PolyCoordType
} from 'ol/interaction/Draw';

import {
  Coordinate
} from 'ol/coordinate';

export function is_PolyCoordType(x: SketchCoordType): x is PolyCoordType {
  if (x==null)
    throw 'fubar';
  else {
    if (_.isArray((x as PolyCoordType)[0][0])) {
      const x2: Coordinate = (x as PolyCoordType)[0][0] as Coordinate;
      if (x2.length==2) {
        // todo: check that each element is a number
        return true;
      } else
        return false;
    } else
      return false;
  }
}

// SketchCoordType = PointCoordType | LineCoordType | PolyCoordType;