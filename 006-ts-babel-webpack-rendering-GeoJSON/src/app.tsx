 import React from 'react';


import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';



  
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
    new Map({
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


    console.log('Countries is: ', Countries);
    new Map({
      target: 'map-container2',
      layers: [
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: Countries as unknown as string // this is working but for some reason TypeScript complains
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });    
  }



  render = () => {
    return (
      <>
        <div>
          <p>
            Provenance: <a href='https://openlayers.org/workshop/en/vector/geojson.html'>https://openlayers.org/workshop/en/vector/geojson.html</a>
          </p>
        </div>
        <h1>Map with VectorSource loaded over the Internet</h1>
        <div id='map-container' style={{width: '100%'
                                      , height: '400px'
                                     ,  backgroundColor: '#04041b'}}>
        </div>
        <br/>
        <br/>
        <br/>
        <h1>Map with VectorSource loaded from our server using a Webpack file-loader</h1>
        <div id='map-container2' style={{width: '100%'
                                       , height: '400px'
                                      ,  backgroundColor: '#04041b'}}>
        </div>        
      </>
    );
  }
}
