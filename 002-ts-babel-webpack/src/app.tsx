import React from 'react';



import {throttle} from 'lodash';


import 'ol/ol.css';
import {Map, View} from 'ol';


import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

 

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
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        /* If the projection is not specified, the default projection is Spherical Mercator (EPSG:3857),
         * with meters as map units.
         */
        center: [5*1000*1000, 5*1000*1000],
        zoom: 6
      })
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
          Provenance: <a href='https://openlayers.org/en/latest/doc/tutorials/bundle.html'>https://openlayers.org/en/latest/doc/tutorials/bundle.html</a>
        </div>
        <div id='map' style={{width: this.state.width || '100%'
                            , height: (this.state.height?`${this.state.height - 100}px`:'400px')}}>
        </div>
      </>
    );
  }
}


