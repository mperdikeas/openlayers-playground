import {getArea} from 'ol/sphere';
import Feature from 'ol/Feature';

//@ts-expect-error TS7016: Could not find a declaration file for module 'colormap'.
import colormap from 'colormap';

const min = 1e8; // the smallest area
const max = 2e13; // the biggest area
const steps = 50;
const ramp = colormap({
  colormap: 'blackbody',
  nshades: steps
});

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(value, high));
}

export function getColor(feature: Feature) {
    const area: number = getArea(feature.getGeometry()!);
    const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
    const index = Math.round(f * (steps - 1));
    return ramp[index];
}

