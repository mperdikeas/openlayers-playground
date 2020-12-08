 import React from 'react';

import {throttle} from 'lodash';

import 'ol/ol.css';
import Map from 'ol/Map';
import {get as getProjection} from 'ol/proj';
import {getCenter} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

/*
 *  NB: it is vitally important that the projections are defined before the layers, otherwise
 *      you get: 
 *
 *      TypeError: Cannot read property 'getAxisOrientation' of null
 *                 at optionsFromCapabilities (WMTS.js?d510:420)
 *                 at eval (base-layers.ts?7d5f:144)
 *
 * .. in the line marked with sse-1607360049 in file ./base-layers.ts
 *
 * NB2: also, and independently of the above problem, if you require the [register-projections.ts]
 *      file (instead of importing it), this causes the [overlay_layers] to be defined *BEFORE*
 *      the code in the [register-projections.ts] file gets executed and that messes up with the
 *      Swiss overlay. Finally, note that the correct execution of the code rests on the assumption
 *      that the code in [register-projections.ts] is executed *BEFORE* the code in [layers.ts]
 *      According to my research this is not given as imported ES6 modules are loaded asynchronously
 *      and the only guarantee provided is that the code of the imported modules gets executed before
 *      the code of the module that imports them. However, it seems to work correctly on Chrome
 *      so I'll leave it at that. Otherwise, i.e. in order to require no assumptions as to the 
 *      execution order of the imported modules, the code would have to be written differently.
 *
 */
//require( './register-projections.ts'); // <--- this messes up with the Swiss overlay

import {
  CustomProjectionName,
  ProjectionName
} from  './register-projections.ts';

import {
  BaseLayerName,
  base_layers,
  OverlayLayerName,
  overlay_layers
} from './layers.ts';


import 'antd/dist/antd.css';
import {Form} from 'antd';
import {Select} from 'antd';
const {Option} = Select;
import { Row, Col } from 'antd';




  
type Props = {}
type LocalState = {height: number | undefined, width: number | undefined}

const DefaultLayer = {
  BASE    : BaseLayerName.OSM,
  OVERLAY : OverlayLayerName.BNG
}


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
      layers: [base_layers[DefaultLayer.BASE], overlay_layers[DefaultLayer.OVERLAY]],
      target: 'map',
      view: new View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 2,
      }),
    });

    console.log('map is created: ', this.map);
  }



  updateScreenSize = () => {
    this.setState({height: $(window).height(), width: $(window).width()});
  }


  onChangeBaseLayer = (value: BaseLayerName) => {
    var layer: TileLayer = base_layers[value];
    if (layer) {
      layer.setOpacity(1);
      this.map!.getLayers().setAt(0, layer);
    }
  }

  onChangeOverlayLayer = (value: OverlayLayerName) => {
    var layer: TileLayer = overlay_layers[value];
    if (layer) {
      layer.setOpacity(1);
      this.map!.getLayers().setAt(1, layer);
    }

  }

  onChangeViewProjection = (value: ProjectionName) => {
    var newProj = getProjection(value);
    var newProjExtent = newProj.getExtent();
    var newView = new View({
      projection: newProj,
      center: getCenter(newProjExtent || [0, 0, 0, 0]),
      zoom: 0,
      extent: newProjExtent || undefined,
    });
    this.map!.setView(newView);

    // Example how to prevent double occurrence of map by limiting layer extent
    if (newProj == getProjection('EPSG:3857')) {
      overlay_layers.bng.setExtent([-1057216, 6405988, 404315, 8759696]);
    } else {
      overlay_layers.bng.setExtent(undefined);
    }
  }


  render = () => {
    return (
      <>
        <div>
          <p>

            
            Provenance: <a href='https://openlayers.org/en/latest/examples/reprojection.html'>https://openlayers.org/en/latest/examples/reprojection.html</a>
          </p>
          <p>
            <b>NB:</b> with various changes
          </p>
        </div>
        <div id='map' style={{width: this.state.width || '100%'
                            , height: (this.state.height?`${this.state.height - 300}px`:'400px')}}>
        </div>

        <Row>
          <Col span={8}>
            <Form.Item label='base layer'>
              <Select
                defaultValue={DefaultLayer.BASE}
                style={{width: '20em'}}
                onChange={this.onChangeBaseLayer}
              >
                <Option value={BaseLayerName.OSM}>OSM (EPSG:3857)</Option>
                <Option value={BaseLayerName.WMS_4326}>WMS (EPSG:4326)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='overlay'>
              <Select
                defaultValue={DefaultLayer.OVERLAY}
                onChange={this.onChangeOverlayLayer}
              >
                <Option value={OverlayLayerName.BNG}>British National Grid (EPSG:27700)</Option>
                <Option value={OverlayLayerName.WMS_21781}>Swisstopo WMS (EPSG:21781)</Option>
                <Option value={OverlayLayerName.WMTS_3413}>NASA Arctic WMTS (EPSG:3413)</Option>
                <Option value={OverlayLayerName.STATES}>United States (EPSG:3857)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='projection'>
              <Select id="view-projection"
                      defaultValue={'EPSG:3857'}
                      onChange={this.onChangeViewProjection}
              >
                <Option value={'EPSG:3857'}>Spherical Mercator (EPSG:3857)</Option>
                <Option value={'EPSG:4326'}>WGS 84 (EPSG:4326)</Option>
                <Option value={CustomProjectionName.EPSG_2100}> Hellenic Geodetic Reference System 1987</Option>
                <Option value={CustomProjectionName.ESRI_54009}>Mollweide (ESRI:54009)</Option>
                <Option value={CustomProjectionName.EPSG_27700}>British National Grid (EPSG:27700)</Option>
                <Option value={CustomProjectionName.EPSG_23032}>ED50 / UTM zone 32N (EPSG:23032)</Option>
                <Option value={CustomProjectionName.EPSG_2163}>US National Atlas Equal Area (EPSG:2163)</Option>
                <Option value={CustomProjectionName.EPSG_3413}>NSIDC Polar Stereographic North (EPSG:3413)</Option>
                <Option value={CustomProjectionName.EPSG_5479}>RSRGD2000 / MSLC2000 (EPSG:5479)</Option>
              </Select>
           </Form.Item>
          </Col>
        </Row>

      </>
    );
  }
}


