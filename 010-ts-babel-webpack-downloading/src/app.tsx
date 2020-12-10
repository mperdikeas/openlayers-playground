import React from 'react';


import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
//@ts-expect-error TS7016: Could not find a declaration file for module 'ol-hashed'
import sync from 'ol-hashed';

import DragAndDrop from 'ol/interaction/DragAndDrop';
import Modify      from 'ol/interaction/Modify';
import Draw        from 'ol/interaction/Draw';
import Snap        from 'ol/interaction/Snap';
import GeometryType from 'ol/geom/GeometryType'

import 'antd/dist/antd.css';
import {
  Row,
  Col,
  Button,
  Anchor
} from 'antd';
const {Link} = Anchor;


type Props = {}
type LocalState = {downloadRef: string | undefined}


import Countries from '../countries.geo.json';

export default class App extends React.Component<Props, LocalState> {

  private source: VectorSource | undefined;

//  private ref = React.createRef<HTMLAnchorElement>();

  constructor(props: Props) {
    super(props);
    this.state =  {downloadRef: undefined}
  }


  componentDidMount = () => {
    this.createMap();
  }

  addChangeListenerOnSource = ()=> {
    const format = new GeoJSON({featureProjection: 'EPSG:3857'});
    //    const download = document.getElementById('download');
    const source = this.source!;
    source.on('change', () => {
      const features = source.getFeatures();
      const json = format.writeFeatures(features);
      this.setState({downloadRef: 'data:text/json;charset=utf-8,' + json});
      console.log('downloadRef was just set to: ', json);
    });
  }

  createMap = () => {
    this.source = new VectorSource({
      format: new GeoJSON(),
      url: Countries as unknown as string // this is working but for some reason TypeScript complains
    });

    this.addChangeListenerOnSource();
    
    const map = new Map({
      target: 'map-container',
      layers: [new VectorLayer({source: this.source})],
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

  onDownload = () => {
    console.log(`onDownload - opening ${this.state.downloadRef}`);
    window.open(this.state.downloadRef);

  }



  render = () => {
    console.log('render');
    return (
      <>
        <div>
          <p>
            Provenance:
            <a href='https://openlayers.org/workshop/en/vector/download.html'>https://openlayers.org/workshop/en/vector/download.html</a>
            <br/>
            <ul>
              <li><b>NB:</b>with various modifications and using the Antd library</li>
              <li><b>NB:</b>downloading from a data URL is not possible in Chrome 86 but is working on Firefox 83</li>
            </ul>
          </p>
        </div>
        <div style={{position: 'relative'}}>
          <div id='map-container' style={{width: '100%'
                                        , height: '400px'
                                       ,  backgroundColor: '#04041b'}}>
          </div>
          <Row id='buttons'>
            <Col span={6}>
              <Button type='primary' onClick={this.onClear}>clear</Button>
            </Col>
            <Col span={6}>
              <Button type='default' onClick={this.onRestore}>restore</Button>
            </Col>            
            <Col span={6}>
              <Button type='link' onClick={this.onDownload}>download</Button>
            </Col>
            <Col span={6}>
              <Anchor>
                <Link title='download' href={this.state.downloadRef} target='_blank'/>
              </Anchor>
            </Col>            
          </Row>
        </div>
      </>
    );
  }
}
