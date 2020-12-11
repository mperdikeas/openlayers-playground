import React from 'react';


import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Modify      from 'ol/interaction/Modify';
import Draw        from 'ol/interaction/Draw';
import Snap        from 'ol/interaction/Snap';
import GeometryType from 'ol/geom/GeometryType'
import {Style, Fill, Stroke} from 'ol/style';
import { StyleFunction } from 'ol/style/Style';

//@ts-expect-error TS7016: Could not find a declaration file for module 'ol-hashed'
import sync from 'ol-hashed';

import 'antd/dist/antd.css';
import {
  Row,
  Col,
  Button,
  Checkbox
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';


import {getColor} from './util.ts';


type Props = {}
type LocalState = {dynamic_style: boolean}


import Countries from '../countries.geo.json';

const static_style = new Style({
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'white'
      })
});

const dynamic_style = function(feature: Feature) {
  return new Style({
    fill: new Fill({
      color: getColor(feature)
    }),
    stroke: new Stroke({
      color: 'rgba(255,255,255,0.8)'
    })
  });
}; 

export default class App extends React.Component<Props, LocalState> {

  private source: VectorSource | undefined;
  private style: Style | StyleFunction | undefined;
  private layer: VectorLayer | undefined;

  constructor(props: Props) {
    super(props);
    this.state =  {dynamic_style: false}
  }


  componentDidMount = () => {
    this.createMap();
  }

  componentDidUpdate = (prevProps: Props, prevState: LocalState) => {
    if (prevState.dynamic_style != this.state.dynamic_style) {
      if (this.state.dynamic_style) {
        // @ts-expect-error
        this.layer!.setStyle( dynamic_style );
      } else {
        this.layer!.setStyle( static_style );
      }
    }
  }

  createMap = () => {
    this.source = new VectorSource({
      format: new GeoJSON(),
      url: Countries as unknown as string // this is working but for some reason TypeScript complains
    });


    this.style = static_style;


    this.layer = new VectorLayer({
      source: this.source,
      style: this.style
    });

    
    const map = new Map({
      target: 'map-container',
      layers: [this.layer],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    sync(map);
    map.addInteraction(new DragAndDrop({
      source: this.source,
      // @ts-expect-error
      formatConstructors: [GeoJSON]
    }));
    map.addInteraction(new Modify({source: this.source}));
    map.addInteraction(new Draw({
      type: GeometryType.POLYGON,
      source: this.source
    }));
    map.addInteraction(new Snap({source: this.source}));
  }

  onClear = () => {
    console.log('onClear');
    this.source!.clear();
  }

  onRestore = () => {
    console.log('onRestore');
    this.source!.refresh();
  }

  onChangeStyle = (e: CheckboxChangeEvent) => {
    this.setState({
      dynamic_style: e.target.checked
    });
  }



  render = () => {
    console.log('render');
    return (
      <>
        <div>
          <p>
            Provenance:
            <a href='https://openlayers.org/workshop/en/vector/style.html'>https://openlayers.org/workshop/en/vector/style.html</a>
          </p>
        </div>
        <div style={{position: 'relative'}}>
          <div id='map-container' style={{width: '100%'
                                        , height: '400px'
                                       ,  backgroundColor: '#04041b'}}>
          </div>
          <Row id='buttons'>
            <Col span={8}>
              <Button type='primary' onClick={this.onClear}>clear</Button>
            </Col>
            <Col span={8}>
              <Button type='default' onClick={this.onRestore}>restore</Button>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={this.state.dynamic_style}
                disabled={false}
                onChange={this.onChangeStyle}
                style={{color: 'white'}}
              >
                use dynamic style
              </Checkbox>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
