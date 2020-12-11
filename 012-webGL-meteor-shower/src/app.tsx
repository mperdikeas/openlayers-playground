import React from 'react';


import 'ol/ol.css';


import {fromLonLat} from 'ol/proj';
import {Map, View} from 'ol';
import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import {Vector as VectorSource, Stamen} from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

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

  componentDidUpdate = (prevProps: Props, prevState: LocalState) => {
  }

  createMap = () => {
    new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: 'toner'
          })
        }),
/*        new VectorLayer({
          source: source
        })*/
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    console.log('map created');
  }
  
  render = () => {
    return (
      <>
        <div>
          <p>
            Provenance:
            <a href='https://openlayers.org/workshop/en/webgl/meteorites.html'>https://openlayers.org/workshop/en/webgl/meteorites.html</a>
          </p>
        </div>

        <div id='map-container' style={{width: '100%'
                                      , height: 'calc(100% - 3em)'
                                      , backgroundColor: 'blue'
                                      , fontFamily: 'sans-serif'}}>
        </div>

      </>
    );
  }
}
