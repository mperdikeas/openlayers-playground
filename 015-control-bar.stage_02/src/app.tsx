import React from 'react';

import 'ol/ol.css';
import {
  Map,
  View
} from 'ol';
import {
  Polygon,
//  GeometryType
} from 'ol/geom'
import GeometryType from 'ol/geom/GeometryType';
import {
  Vector as VectorSource,
  OSM
} from 'ol/source';
import {
  Tile,
  Vector as VectorLayer
} from 'ol/layer';
import {
  Select,
  Draw
} from 'ol/interaction';
import Bar    from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';
import TextButton from 'ol-ext/control/TextButton';


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

    /*    const editbar = new Bar(
       // @ts-expect-error
       {
       toggleOne: true,
       group:false
       });
       mainbar.addControl(editbar);
     */

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


    const fedit = new Toggle(
      // @ts-expect-error
      {
      html: '<i class="fa fa-bookmark fa-rotate-270" ></i>',
      title: 'Polygon',
      interaction: new Draw({
        type: GeometryType.POLYGON,
        source: vector.getSource(),
        // Count inserted points
        geometryFunction: function(coordinates, geometry) {
          console.log('coordinates is: ', coordinates);
          console.log('geometry is: ', geometry);
          this.nbpts = coordinates[0].length;
          if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
          else geometry = new Polygon(coordinates);
          return geometry;
        }
      }),
      // Options bar associated with the control
        bar: new Bar(
          // @ts-expect-error
          {
        controls:[
          new TextButton(
            // @ts-expect-error
            {
            html: 'undo',
            title: "undo last point",
              handleClick: function() {
                //                (fedit.getInteraction() as Draw).removeLastPoint();
                // @ts-expect-error
                if (fedit.getInteraction().nbpts>1) fedit.getInteraction().removeLastPoint();
            }
          }),
          new TextButton(
            //@ts-expect-error
            {
            html: 'finish',
            title: "finish",
            handleClick: function() {
              // Prevent null objects on finishDrawing
              // @ts-expect-error
              if (fedit.getInteraction().nbpts>3) fedit.getInteraction().finishDrawing();
            }
          })
        ]
      }) 
    });

    mainbar.addControl(selectCtrl);
    mainbar.addControl(fedit);

    /*
       // Edit control bar
       // @ts-expect-error (I know how to solve this)
       const editbar = new Bar({
       toggleOne: true,	// one control active at the same time
       group:false	// group controls together
       });
       mainbar.addControl(editbar);
     */
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

