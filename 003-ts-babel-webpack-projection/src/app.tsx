import React from 'react';

import {throttle} from 'lodash';


import 'ol/ol.css';
import {Map, View} from 'ol';

import TileLayer from 'ol/layer/Tile';
import TileWMS   from 'ol/source/TileWMS';
 

type Props = {}
type LocalState = {height: number | undefined, width: number | undefined}

export default class App extends React.Component<Props, LocalState> {

  constructor(props: Props) {
    super(props);
    this.state =  {height: $(window).height(), width: $(window).width()};
    this.updateScreenSize = throttle(this.updateScreenSize.bind(this), 1000);
  }

  private map: Map | undefined;

  componentDidMount = () => {
    this.updateScreenSize();
    window.addEventListener('resize', this.updateScreenSize)

    this.createMap();
  }

  createMap = () => {
    this.map = new Map({
      target: 'map',
      view: new View({
        projection: 'EPSG:3857', //HERE IS THE VIEW PROJECTION
        center: [0, 0],
        zoom: 2
      }),
      layers: [
        new TileLayer({
          source: new TileWMS({
            projection: 'EPSG:4326', //HERE IS THE DATA SOURCE PROJECTION
            url: 'http://demo.boundlessgeo.com/geoserver/wms',
            params: {
              'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
            }
          })
        })
      ]
    });
    console.debug('map created: ', this.map);
  }


  updateScreenSize = () => {
    this.setState({height: $(window).height(), width: $(window).width()});
  }


  render = () => {
    return (
      <>
        <div>
          Provenance: <a href='https://openlayers.org/en/latest/doc/tutorials/raster-reprojection.html'>https://openlayers.org/en/latest/doc/tutorials/raster-reprojection.html</a>
          <p>
            <b>NB:</b> On December 4th when I tried this, I was getting net::ERR_CONNECTION_TIMED_OUT
        </div>
        <div id='map' style={{width: this.state.width || '100%'
                            , height: (this.state.height?`${this.state.height - 100}px`:'400px')}}>
        </div>
      </>
    );
  }
}


