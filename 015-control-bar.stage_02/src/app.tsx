import React from 'react';

import 'ol/ol.css';
import {
  Map,
  View
} from 'ol';

import {
  //  GeometryFunction,
  SketchCoordType,
  PolyCoordType
} from 'ol/interaction/Draw';

import GeometryType from 'ol/geom/GeometryType';
import {
  SimpleGeometry,
  Polygon
} from 'ol/geom';
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
  Draw,
  Snap
} from 'ol/interaction';
import Bar    from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';
import TextButton from 'ol-ext/control/TextButton';


import {is_PolyCoordType} from './util.ts';

/* 
 * Provenance:
 * 
 *     https://viglino.github.io/ol-ext/examples/bar/map.control.editionbar.html
 *     https://viglino.github.io/ol-ext/examples/bar/map.control.toggle.html
 *     https://gis.stackexchange.com/q/385340/158056
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


    map.addInteraction(new Snap({
      source: vector.getSource()
    }));


    // Main control bar
    const mainbar = new Bar(
      //@ts-expect-error
      {className: 'mainbar',
       toggleOne: true,
       group: false
    });
    map.addControl(mainbar);

    /*    const editbar = new Bar(
       // @ts-expect-error
       {
       toggleOne: true,
       group:false
       });
       mainbar.addControl(editbar);
     */

    const selectCtrl = new Toggle(
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
          geometryFunction: function (coordinates: SketchCoordType, geometry: SimpleGeometry | undefined) {
            console.log('coordinates is: ', coordinates);
            if (is_PolyCoordType(coordinates)) {
              const coordinates2: PolyCoordType = coordinates;
              console.log('geometry is: ', geometry);
              const num = coordinates2[0].length;
              (this as unknown as {nbpts: number}).nbpts = num
              console.log(`assigning number of points as: ${num}`);
              /*
               * I was initially under the impression that the concatenation used in the live code 
               * below was not necessary the below simpler line of code worked equally well:
               *
               *     if (geometry) geometry.setCoordinates(coordinates2)
               * 
               * However, in late January 2021 I realized that this is not so and that the concatenation
               * is indeed necessary to properly close the polygon.
               *
               */
              if (geometry) geometry.setCoordinates([coordinates2[0].concat([coordinates[0][0]])]);
              else geometry = new Polygon(coordinates2);
              return geometry;
            } else
              throw 'fubar';
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
                (fedit.getInteraction() as Draw).removeLastPoint();
            }
          }),
          new TextButton(
            //@ts-expect-error
            {
            html: 'finish',
            title: "finish",
              handleClick: function() {
                const num: number = (fedit.getInteraction() as unknown as {nbpts: number}).nbpts;
                if (num >=4) {
                  (fedit.getInteraction() as Draw).finishDrawing();
                  console.log(`drawing finished: number of vectors is: ${vector.getSource().getFeatures().length}`);
                } else {
                  console.log(`insufficient number of points (${num}) to add polygon feature to layer`);
                }
            }
          })
        ]
      }) 
    });

    mainbar.addControl(selectCtrl);
    mainbar.addControl(fedit);
  }

  
  render = () => {
    return (
      <>
        <div>
          Provenance:
          <ul>
            <li><a href='https://viglino.github.io/ol-ext/examples/bar/map.control.editionbar.html'>https://viglino.github.io/ol-ext/examples/bar/map.control.editionbar.html</a></li>
            <li><a href='https://viglino.github.io/ol-ext/examples/bar/map.control.toggle.html'>https://viglino.github.io/ol-ext/examples/bar/map.control.toggle.html</a></li>
            <li><a href='https://gis.stackexchange.com/q/385340/158056'>https://gis.stackexchange.com/q/385340/158056</a></li>
          </ul>
        </div>
        <div id='map-container'>
        </div>
        <textarea id='info' style={{width:'25em', height:'10em'}}></textarea>
      </>
    );
  }
}

