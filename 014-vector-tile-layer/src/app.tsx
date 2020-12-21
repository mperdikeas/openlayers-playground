import React from 'react';

import 'ol/ol.css';
import {Map, View} from 'ol';
import {getCenter} from 'ol/extent';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
//import {fromLonLat} from 'ol/proj';

import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';


/* 
 * Provenance:
 * 
 *     https://cloud.maptiler.com/tiles/v3-2154/
 *     https://epsg.io/2154
 *
 */
const EPSG_2154 = 'EPSG:2154';

proj4.defs(EPSG_2154
         , "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);





const proj = getProjection(EPSG_2154);
proj.setExtent([-378305.81, 6093283.21, 1212610.74, 7186901.68]);
const extent = proj.getExtent();

console.log('extent is: ', extent);








type Props = {}
type LocalState = {}

export default class App extends React.Component<Props, LocalState> {


  constructor(props: Props) {
    super(props);
    this.state =  {};
  }


  componentDidMount = () => {
    this.createMap();
  }


  createMap = () => {
    const key = '7A1r9pfPUNpumR1hzV0k';
    const layer = new VectorTileLayer({
      source: new VectorTileSource({
        attributions: [
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        ],
        /*
         *    It is vitally important that the Vector Tile Source projection be explicitly declared and
         *    be the same as the view projection, otherwise you get:
         *
         *        https://github.com/openlayers/openlayers/issues/11429
         *
         */
        projection: EPSG_2154,
        format: new MVT(),
        url: `https://api.maptiler.com/tiles/v3-2154/{z}/{x}/{y}.pbf?key=${key}`,
        maxZoom: 14
      })
    });

    const center = getCenter(extent);
    console.log('center is: ', center);
    const map = new Map({
      target: 'map-container',
      view: new View({
        projection: EPSG_2154,
        center,
        zoom: 2
      })
    });

    map.addLayer(layer);
  }

  
  render = () => {
    return (
      <>
        <p>
          Provenance: <a href='https://openlayers.org/workshop/en/vectortile/map.html'>https://openlayers.org/workshop/en/vectortile/map.html</a>
          <br/>
          However apparently the URL supplied in the example is not working.
          <br/>
          So I used instead another link found <a href='https://cloud.maptiler.com/tiles/v3-2154/'>here</a> along
          with a key I created for myself
        </p>
        <p>
          I still haven't figured out how to properly center on France
        </p>
      <div id='map-container'>
      </div>
      </>
    );
  }
}


