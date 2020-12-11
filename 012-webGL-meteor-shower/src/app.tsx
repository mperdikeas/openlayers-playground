import React from 'react';


import 'ol/ol.css';

import GeoJSON from 'ol/format/GeoJSON';
import {fromLonLat} from 'ol/proj';
import {Map, View} from 'ol';
import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import {Vector as VectorSource, Stamen} from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Style, Fill, Stroke} from 'ol/style';

type Props = {}
type LocalState = {}

import Countries from '../countries.geo.json';




export default class App extends React.Component<Props, LocalState> {


  constructor(props: Props) {
    super(props);
    this.state =  {}
  }


  componentDidMount = () => {
    const source = new VectorSource();
    populateSource(source);
    this.createMap(source);
  }

  componentDidUpdate = (prevProps: Props, prevState: LocalState) => {
  }

  createMap = (source: VectorSource) => {


    new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: 'toner'
          })
          , opacity: 1
        }),
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: Countries as unknown as string // this is working but for some reason TypeScript complains
          }),
          opacity: 0.3,
          style: new Style({
            fill: new Fill({
              color: 'blue'
            }),
            stroke: new Stroke({
              color: 'red',
              width: 3
            })
          })
        }),
        new VectorLayer({
          source: source
        })
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
                                      , fontFamily: 'sans-serif'}}>
        </div>

      </>
    );
  }
}


function populateSource(source: VectorSource) {
  const client = new XMLHttpRequest();
  client.open('GET', '/meteorites.csv');
  client.onload = function() {
    const csv = client.responseText;
    const features = [];

    let prevIndex = csv.indexOf('\n') + 1; // scan past the header line

    let curIndex;
    while ((curIndex = csv.indexOf('\n', prevIndex)) != -1) {
      const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
      prevIndex = curIndex + 1;

      const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
      if (isNaN(coords[0]) || isNaN(coords[1])) {
        // guard against bad data
        continue;
      }

      features.push(new Feature({
        mass: parseFloat(line[1]) || 0,
        year: parseInt(line[2]) || 0,
        geometry: new Point(coords)
      }));
    }
    source.addFeatures(features);
  };
  client.send();
}
