import React from 'react';

import 'ol/ol.css';
import {
  Map,
  View
} from 'ol';
import {
  Vector as VectorSource,
  OSM
} from 'ol/source';
import {
  Tile,
  Vector as VectorLayer
} from 'ol/layer';
import {
  Select
} from 'ol/interaction';
import Bar    from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';


/* 
 * Provenance:
 * 
 *     https://viglino.github.io/ol-ext/examples/bar/map.control.editionbar.html
 *     https://viglino.github.io/ol-ext/examples/bar/map.control.toggle.html
 *
 */

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
    //  Vector layer
    const vector = new VectorLayer( { source: new VectorSource() })


    const map = new Map({
      target: 'map-container',
      view: new View({
        zoom: 14,
        center: [270701, 6247637]
      }),
      layers: [
        new Tile({ source: new OSM() }),
        vector
      ]
    });

    // Main control bar
    const mainbar = new Bar(
      //@ts-expect-error
      {className: 'mainbar'});
    map.addControl(mainbar);

    var selectCtrl = new Toggle(
      // @ts-expect-error
      {	html: '<i class="fa fa-hand-pointer"></i>',
       className: "select",
       title: "Select",
       interaction: new Select (),
       active:true,
       onToggle: (active) => {
         $("#info").text("Select is "+(active?"activated":"deactivated"));
	}
    });

    mainbar.addControl(selectCtrl);

  }

  
  render = () => {
    return (
      <>
        <div>
          Provenance:
          <ul>
            <li><a href='https://viglino.github.io/ol-ext/examples/bar/map.control.editionbar.html'>https://viglino.github.io/ol-ext/examples/bar/map.control.editionbar.html</a></li>
            <li><a href='https://viglino.github.io/ol-ext/examples/bar/map.control.toggle.html'>https://viglino.github.io/ol-ext/examples/bar/map.control.toggle.html</a></li>
          </ul>
        </div>
        <div id='map-container'>
        </div>
        <textarea id='info' style={{width:'25em', height:'10em'}}></textarea>
      </>
    );
  }
}

