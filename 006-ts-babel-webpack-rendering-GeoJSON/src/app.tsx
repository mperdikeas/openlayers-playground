 import React from 'react';


import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';



  
type Props = {}
type LocalState = {}



export default class App extends React.Component<Props, LocalState> {

  constructor(props: Props) {
    super(props);
    this.state =  {}
  }

  private map: Map | undefined;


  componentDidMount = () => {
    this.createMap();
  }

  createMap = () => {
    this.map = new Map({
      target: 'map-container',
      layers: [
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    console.log('map is created: ', this.map);
  }



  render = () => {
    return (
      <>
        <div>
          <p>
            Provenance: <a href='https://openlayers.org/workshop/en/vector/geojson.html'>https://openlayers.org/workshop/en/vector/geojson.html</a>
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
