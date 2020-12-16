import React from 'react';

import 'antd/dist/antd.css';
import {
  Row,
  Col,
  Button,
  Switch
} from 'antd';

//import {CheckboxChangeEvent} from 'antd/es/checkbox/Checkbox';



import {SymbolType} from 'ol/style/LiteralStyle';
import {WebGLPoints as WebGLPointsLayer} from 'ol/layer';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {fromLonLat} from 'ol/proj';
import {Map, View} from 'ol';
import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import {Vector as VectorSource, Stamen} from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Style, Fill, Stroke} from 'ol/style';
import {LiteralStyle} from 'ol/style/LiteralStyle';
import {StatusCodes} from 'http-status-codes';
import {
  AxiosResponse,
  AxiosError
} from 'axios';
import _ from 'lodash';



import Countries from '../countries.geo.json';

import {axiosPlain} from './axios-setup.ts';



function getResource<T>(url: string): Promise<T> {
    const axiosCall = axiosPlain.get(url);        
    return axiosCall.then( (res: AxiosResponse<T>):Promise<T> => {
        const SUCCESS_CODES = [StatusCodes.OK];
        if (!_.includes(SUCCESS_CODES, res.status)) {
            const MSG = `[${URL}]: returned status code of ${res.status} is not `+
                `among the ${SUCCESS_CODES.length} accepted status codes: ${SUCCESS_CODES}`;
            console.error(MSG, res);
            return Promise.reject(`invalid status: ${res.status}`);
        } else {
            return Promise.resolve(res.data);
        }
    }).catch( (err: AxiosError<any>): Promise<any> => {
        console.error(err);
        return Promise.reject(err);
    });
}


type Props = {}
type LocalState = {fancy: boolean}


export default class App extends React.Component<Props, LocalState> {


  constructor(props: Props) {
    super(props);
    this.state =  {fancy: false};
  }

  source    : undefined | VectorSource;
  meteorites: undefined | WebGLPointsLayer;
  map       : undefined | Map;

  componentDidMount = () => {
    this.source = new VectorSource();
    populateSource(this.source);
    this.map = this.createMap();
  }

  componentDidUpdate = (prevProps: Props, prevState: LocalState) => {
    if (prevState.fancy !== this.state.fancy) {
      this.meteorites = this.createMeteoritesLayer();
      this.map!.getLayers().setAt(2, this.meteorites);
    }
  }

  createMeteoritesLayer = () => {
    return new WebGLPointsLayer({
      source: this.source,
      style: this.state.fancy?style_fancy:style_plain
    });
  }

  createMap = () => {

    this.meteorites = this.createMeteoritesLayer()


    return new Map({
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
        this.meteorites 
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }

  clear = () => {
    this.source!.clear(true);
  }

  reload = () => {
    populateSource(this.source!);
  }

  onChangeStyle = (v: boolean) => {
    this.setState({fancy: v});
  }
  
  render = () => {
    return (
      <>
        <div>
          <Row>
            <Col span={12}>
              <p>
                Provenance:
                <a href='https://openlayers.org/workshop/en/webgl/points.html'>https://openlayers.org/workshop/en/webgl/points.html</a>
                <br/>
                See also <a href='https://stackoverflow.com/q/65326034/274677'>https://stackoverflow.com/q/65326034/274677</a>
              </p>
            </Col>
            <Col span={12}>
              <Button danger onClick={this.clear}>clear</Button>
              <Button onClick={this.reload}>reload</Button>
              <label>
                fancy markers
                <Switch checked={this.state.fancy} onChange={this.onChangeStyle}/>
              </label>
            </Col>
            </Row>

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
  const URL = '/meteorites.csv';
  const use_axios = Math.random()>0.5; // both axios and plain XMLHttpRequest are working
  if (use_axios) {
    getResource<string>(URL)
      .then( (res: string) =>{
        parseCSVAndPopulateSource(use_axios, res, source);
      }).catch( (err: any) => {
        throw err;
      });
  } else {
    const client = new XMLHttpRequest();
    client.open('GET', '/meteorites.csv');
    client.onload = function() {
      const csv = client.responseText;
      parseCSVAndPopulateSource(use_axios, csv, source);
    };
    client.send();
  }
}

function parseCSVAndPopulateSource(use_axios: boolean, csv: string, source: VectorSource) {
  const features = [];

  let prevIndex = csv.indexOf('\n') + 1; // scan past the header line

  let curIndex;
  let num_of_features = 0;
  while ((curIndex = csv.indexOf('\n', prevIndex)) != -1) {
    const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
    prevIndex = curIndex + 1;
    // add some random noise so that additional reloads do not perfectly overlap and thus can be visible
    const coords = fromLonLat([parseFloat(line[4])+(Math.random()*2-1), parseFloat(line[3])+(Math.random()*2-1)]);
    if (isNaN(coords[0]) || isNaN(coords[1])) {
      // guard against bad data
      continue;
    }

    features.push(new Feature({
      mass: parseFloat(line[1]) || 0,
      year: parseInt(line[2]) || 0,
      geometry: new Point(coords)
    }));
    num_of_features++;
  }
  console.log(`${num_of_features} features loaded using ${use_axios?'Axios':'plain Ajax'}`);
  source.addFeatures(features);
}


const style_plain: LiteralStyle = {
  symbol: {
    symbolType: SymbolType.SQUARE,
    size: 10,
    color: 'rgba(255,0,0,0.5)'
  }
};

const style_fancy: LiteralStyle = {
  symbol: {
    symbolType: SymbolType.CIRCLE,
    // equivalent to: 18 * clamp('mass' / 200000, 0, 1) + 8
    size: ['+', ['*', ['clamp', ['*', ['get', 'mass'], 1/20000], 0, 1], 18], 8],
    color: 'rgba(255,0,0,0.5)'
  }
};

