 import React from 'react';

import {throttle} from 'lodash';

import 'ol/ol.css';
import Map from 'ol/Map';
//import TileGrid from 'ol/tilegrid/TileGrid';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
/*import Collection from 'ol/Collection';
import BaseLayer from 'ol/layer/Base';*/
//import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
//import WMTSCapabilities from 'ol/format/WMTSCapabilities';
//import proj4 from 'proj4';
//import {OSM, TileImage, TileWMS} from 'ol/source';
//import {getCenter, getWidth} from 'ol/extent';
//import {get as getProjection} from 'ol/proj';


//import {register} from 'ol/proj/proj4';

import {
  BaseLayerName,
  base_layers,
  OverlayLayerName,
  overlay_layers
} from './base-layers.ts';

/*
import {
  BaseLayerName,
  base_layers,

} from './base-layers.ts';
*/

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

/*const DEFAULT_BASE_LAYER    = 
const DEFAULT_OVERLAY_LAYER = 
*/


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
              <Select id="view-projection">
                <Option value="EPSG:3857">Spherical Mercator (EPSG:3857)</Option>
                <Option value="EPSG:4326">WGS 84 (EPSG:4326)</Option>
                <Option value="ESRI:54009">Mollweide (ESRI:54009)</Option>
                <Option value="EPSG:27700">British National Grid (EPSG:27700)</Option>
                <Option value="EPSG:23032">ED50 / UTM zone 32N (EPSG:23032)</Option>
                <Option value="EPSG:2163">US National Atlas Equal Area (EPSG:2163)</Option>
                <Option value="EPSG:3413">NSIDC Polar Stereographic North (EPSG:3413)</Option>
                <Option value="EPSG:5479">RSRGD2000 / MSLC2000 (EPSG:5479)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

      </>
    );
  }
}


