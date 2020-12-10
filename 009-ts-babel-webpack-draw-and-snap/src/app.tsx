 import React from 'react';


import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
//@ts-expect-error TS7016: Could not find a declaration file for module 'ol-hashed'
import sync from 'ol-hashed';

import DragAndDrop from 'ol/interaction/DragAndDrop';
import Modify      from 'ol/interaction/Modify';
import Draw        from 'ol/interaction/Draw';
import Snap        from 'ol/interaction/Snap';


import GeometryType from 'ol/geom/GeometryType'

type Props = {}
type LocalState = {}


import Countries from '../countries.geo.json';

export default class App extends React.Component<Props, LocalState> {

  constructor(props: Props) {
    super(props);
    this.state =  {}
  }


  componentDidMount = () => {
    this.createMap();
  }

  createMap = () => {
    const source = new VectorSource({
      format: new GeoJSON(),
      url: Countries as unknown as string // this is working but for some reason TypeScript complains
    });
    const map = new Map({
      target: 'map-container',
      layers: [new VectorLayer({source})],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    sync(map);
    map.addInteraction(new DragAndDrop({
      source: source,
      // @ts-expect-error
      formatConstructors: [GeoJSON]
    }));
    map.addInteraction(new Modify({source}));
    map.addInteraction(new Draw({
      type: GeometryType.POLYGON,
      source: source
    }));
    map.addInteraction(new Snap({source}));
  }



  render = () => {
    return (
      <>
        <div>
          <p>
            Provenance: <a href='https://openlayers.org/workshop/en/vector/draw.html'>https://openlayers.org/workshop/en/vector/draw.html</a> and <a href='https://openlayers.org/workshop/en/vector/snap.html'>https://openlayers.org/workshop/en/vector/snap.html</a>
            <br/>
            (with various modifications)
          </p>
        </div>
        <div id='map-container' style={{width: '100%'
                                      , height: '400px'
                                     ,  backgroundColor: '#04041b'}}>
        </div>
      </>
    );
  }
}
