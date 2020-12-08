import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';

export enum CustomProjectionName {
    EPSG_2100 = 'EPSG:2100',
    EPSG_27700 = 'EPSG:27700',
    EPSG_23032 = 'EPSG:23032',
    EPSG_5479 = 'EPSG:5479',
    EPSG_21781 = 'EPSG:21781',
    EPSG_3413 = 'EPSG:3413',
    EPSG_2163 = 'EPSG:2163',
    ESRI_54009 = 'ESRI:54009'

}

export type ProjectionName = CustomProjectionName | 'EPSG:3857' | 'EPSG:4326'

proj4.defs(CustomProjectionName.EPSG_2100,
           '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 '+
           '+x_0=500000 +y_0=0 +ellps=GRS80 '+
           '+towgs84=-199.87,74.79,246.62,0,0,0,0 '+
           '+units=m +no_defs');
// source for HGRS'87 definition: https://en.wikipedia.org/wiki/Hellenic_Geodetic_Reference_System_1987


proj4.defs(
    CustomProjectionName.EPSG_27700,
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs'
);
proj4.defs(
    CustomProjectionName.EPSG_23032,
  '+proj=utm +zone=32 +ellps=intl ' +
    '+towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs'
);
proj4.defs(
    CustomProjectionName.EPSG_5479,
  '+proj=lcc +lat_1=-76.66666666666667 +lat_2=' +
    '-79.33333333333333 +lat_0=-78 +lon_0=163 +x_0=7000000 +y_0=5000000 ' +
    '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
proj4.defs(
    CustomProjectionName.EPSG_21781,
  '+proj=somerc +lat_0=46.95240555555556 ' +
    '+lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs'
);
proj4.defs(
    CustomProjectionName.EPSG_3413,
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 ' +
    '+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
proj4.defs(
    CustomProjectionName.EPSG_2163,
  '+proj=laea +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0 ' +
    '+a=6370997 +b=6370997 +units=m +no_defs'
);
proj4.defs(
    CustomProjectionName.ESRI_54009,
  '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 ' + '+units=m +no_defs'
);
register(proj4);

const proj27700 = getProjection(CustomProjectionName.EPSG_27700);
proj27700.setExtent([0, 0, 700000, 1300000]);

const proj23032 = getProjection(CustomProjectionName.EPSG_23032);
proj23032.setExtent([-1206118.71, 4021309.92, 1295389.0, 8051813.28]);

const proj5479 = getProjection(CustomProjectionName.EPSG_5479);
proj5479.setExtent([6825737.53, 4189159.8, 9633741.96, 5782472.71]);

const proj21781 = getProjection(CustomProjectionName.EPSG_21781);
proj21781.setExtent([485071.54, 75346.36, 828515.78, 299941.84]);

const proj3413 = getProjection(CustomProjectionName.EPSG_3413);
proj3413.setExtent([-4194304, -4194304, 4194304, 4194304]);

const proj2163 = getProjection(CustomProjectionName.EPSG_2163);
proj2163.setExtent([-8040784.5135, -2577524.921, 3668901.4484, 4785105.1096]);

const proj54009 = getProjection(CustomProjectionName.ESRI_54009);
proj54009.setExtent([-18e6, -9e6, 18e6, 9e6]);

