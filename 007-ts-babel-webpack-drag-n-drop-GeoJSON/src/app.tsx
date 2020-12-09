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

  
type Props = {}
type LocalState = {}




export default class App extends React.Component<Props, LocalState> {

  constructor(props: Props) {
    super(props);
    this.state =  {}
  }


  componentDidMount = () => {
    this.createMap();
  }

  createMap = () => {
    const source = new VectorSource(); 
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

  }



  render = () => {
    return (
      <>
        <div>
          <p>
            Provenance: <a href='https://openlayers.org/workshop/en/vector/drag-n-drop.html'>https://openlayers.org/workshop/en/vector/drag-n-drop.html</a>
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
