 import React from 'react';

import {throttle} from 'lodash';


import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';




  
type Props = {}
type LocalState = {
  height: number | undefined,
  width: number | undefined
}


export default class App extends React.Component<Props, LocalState> {

  constructor(props: Props) {
    super(props);
    this.state =  {
      height: $(window).height(),
      width: $(window).width()
    };
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
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new XYZSource({
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
          })
        })
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
      })
    });

    
    console.log('map is created: ', this.map);
  }


  updateScreenSize = () => {
    this.setState({height: $(window).height(), width: $(window).width()});
  }


  render = () => {
    return (
      <>
        <div>
          <p>
            Provenance: <a href='https://openlayers.org/workshop/en/basics/'>https://openlayers.org/workshop/en/basics/</a>
          </p>
        </div>
        <div id='map-container' style={{width: this.state.width || '100%'
                            , height: (this.state.height?`${this.state.height - 300}px`:'400px')}}>
        </div>
      </>
    );
  }
}
