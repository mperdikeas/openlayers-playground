
/*
 * Provenance:
 * 
 *     https://cloud.maptiler.com/tiles/v3-2154/
 *     https://epsg.io/2154
 *
 */
const EPSG_2154 = 'EPSG:2154';

proj4.defs(EPSG_2154
           , "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);





const proj = ol.proj.get(EPSG_2154);
proj.setExtent([-378305.81, 6093283.21, 1212610.74, 7186901.68]);
const extent = proj.getExtent();

console.log('extent is: ', extent);








const key = '7A1r9pfPUNpumR1hzV0k';

const tileGridOpts = {"extent": [0.0, 6000000.0, 1250000.0, 12000000.0], "minZoom": 0, "sizes": [[1, 1], [2, 2], [4, 4], [8, 8], [16, 16], [32, 32], [64, 64], [128, 128], [256, 256], [512, 512], [1024, 1024], [2048, 2048], [4096, 4096], [8192, 8192], [16384, 16384]], "tileSizes": [[512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512], [512, 512]], "resolutions": [52289.612274947, 26144.8061374735, 13072.4030687368, 6536.2015343684, 3268.1007671842, 1634.0503835921, 817.02519179605, 408.512595898025, 204.256297949012, 102.128148974506, 51.064074487253, 25.5320372436265, 12.7660186218133, 6.38300931090665, 3.19150465545333]};

const layer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
        attributions: [
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        ],
        /*
         *    It is vitally important that the Vector Tile Source projection be explicitly declared and
         *    be the same as the view projection, otherwise you get:
         *
         *        https://github.com/openlayers/openlayers/issues/11429
         *
         */
        projection: EPSG_2154,
        format: new ol.format.MVT(),
        url: `https://api.maptiler.com/tiles/v3-2154/{z}/{x}/{y}.pbf?key=${key}`,
        maxZoom: 14,
        tileGrid: new ol.tilegrid.TileGrid(tileGridOpts)
    })
});

const center = ol.extent.getCenter(extent);
console.log('center is: ', center);
const map = new ol.Map({
    target: 'map-container',
    view: new ol.View({
        projection: EPSG_2154,
        center,
        zoom: 2
    })
});

map.addLayer(layer);
