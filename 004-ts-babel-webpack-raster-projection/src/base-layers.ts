//import Map from 'ol/Map';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileLayer from 'ol/layer/Tile';
//import View from 'ol/View';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
//import proj4 from 'proj4';
import {OSM/*, TileImage, */, TileWMS} from 'ol/source';
import {/*getCenter, */getWidth} from 'ol/extent';
import {get as getProjection} from 'ol/proj';
//import {register} from 'ol/proj/proj4';



export enum BaseLayerName {
    OSM = 'osm',
    WMS_4326 = 'wms_4326'
}

export enum OverlayLayerName {
    WMS_21781 = 'wms_21781',
    WMTS_3413 = 'wmts_3413',
    BNG = 'bng',
    STATES = 'states'
}

export type BaseLayers = Record<BaseLayerName, TileLayer>;

export type OverlayLayers = Record<OverlayLayerName, TileLayer>;

export const base_layers: BaseLayers = (()=>{
    const osmTileLayer = new TileLayer({
        source: new OSM(),
    });

    const wms4326Layer = new TileLayer({
        source: new TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            crossOrigin: '',
            params: {
                'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
                'TILED': true,
            },
            projection: 'EPSG:4326',
        })
    });


    return {
        [BaseLayerName.OSM]: osmTileLayer,
        [BaseLayerName.WMS_4326]: wms4326Layer
    };

})();


export const overlay_layers: OverlayLayers = (()=>{

    const wms21781Layer = new TileLayer({
    source: new TileWMS({
        attributions:
        '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
            'en/home.html">Pixelmap 1:1000000 / geo.admin.ch</a>',
        crossOrigin: 'anonymous',
        params: {
            'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
            'FORMAT': 'image/jpeg',
        },
        url: 'https://wms.geo.admin.ch/',
        projection: 'EPSG:21781',
    }),
    });

    const wmts3413 = new TileLayer();

    const bng = new TileLayer();

    const states = new TileLayer({
        source: new TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            crossOrigin: '',
            params: {'LAYERS': 'topp:states'},
            serverType: 'geoserver',
            tileGrid: new TileGrid({
                extent: [-13884991, 2870341, -7455066, 6338219],
                resolutions: resolutions(),
                tileSize: [512, 256],
            }),
            projection: 'EPSG:3857',
        }),
    });
    return {
        [OverlayLayerName.WMS_21781]: wms21781Layer,
        [OverlayLayerName.WMTS_3413]: wmts3413,
        [OverlayLayerName.BNG]: bng,
        [OverlayLayerName.STATES]: states
    };

})();





var parser = new WMTSCapabilities();


{
var urlA =
    'https://map1.vis.earthdata.nasa.gov/wmts-arctic/' +
    'wmts.cgi?SERVICE=WMTS&request=GetCapabilities';
fetch(urlA)
    .then(function (response) {
        return response.text();
    })
        .then(function (text) {
            console.log('URL A: ', text);
        var result = parser.read(text);
        var options = optionsFromCapabilities(result, {
            layer: 'OSM_Land_Mask',
            matrixSet: 'EPSG3413_250m',
        });
        options.crossOrigin = '';
        options.projection = 'EPSG:3413';
        options.wrapX = false;
        overlay_layers[OverlayLayerName.WMTS_3413].setSource(new WMTS(options));
    })
        .catch( (error) => {
            console.error(error);
        });
}



{
    var urlB =
        'https://tiles.arcgis.com/tiles/qHLhLQrcvEnxjtPr/arcgis/rest/services/OS_Open_Raster/MapServer/WMTS';
    fetch(urlB)
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            console.log('URL B: ', text);
            var result = parser.read(text);
            var options = optionsFromCapabilities(result, {
                layer: 'OS_Open_Raster',
            });
            options.attributions =
                'Contains OS data © Crown Copyright and database right 2019';
            options.crossOrigin = '';
            options.projection = 'EPSG:27700';
            options.wrapX = false;
            overlay_layers[OverlayLayerName.BNG].setSource(new WMTS(options));
        })
        .catch( (error) => {
            console.error(error);
        });
}

function resolutions(): number[] {
    const startResolution = getWidth(getProjection('EPSG:3857').getExtent()) / 256;
    const resolutions = new Array(22);
    for (let i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
    }
    return resolutions;
}




