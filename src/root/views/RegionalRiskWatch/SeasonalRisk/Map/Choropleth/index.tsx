import React from 'react';
import { MapChildContext } from '@togglecorp/re-map';

import { COLOR_LIGHT_GREY } from '#utils/map';
import {
  RISK_HIGH_COLOR,
  RISK_LOW_COLOR,
} from '../../common';

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hexString: string): ColorRGB {
  const colors = hexString.match(/\w\w/g)?.map(x => parseInt(x, 16)) ?? [0, 0, 0];
  return { r: colors[0], g: colors[1], b: colors[2] };
}

function interpolateColor(startColor: ColorRGB, endColor: ColorRGB, progress: number): ColorRGB {
  const remaining = 1 - progress;

  return {
    r: Math.round(startColor.r * remaining + endColor.r * progress),
    g: Math.round(startColor.g * remaining + endColor.g * progress),
    b: Math.round(startColor.b * remaining + endColor.b * progress),
  };
}

function rgbToHex(color: ColorRGB) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function getProgress(currentValue: number, minValue: number, maxValue: number) {
  const diff = maxValue - minValue;
  const diffSafe = diff === 0 ? 1 : diff;
  const progress = currentValue / diffSafe;

  return progress;
}

interface Props {
  riskData: { iso3: string, value: number }[];
}

function Choropleth(props: Props) {
  const { riskData } = props;

  const mc = React.useContext(MapChildContext);

  if (!mc) {
    return null;
  }

  const map = mc.map;

  if (!map || !map.isStyleLoaded()) {
    return null;
  }

  const min = Math.min(...riskData.map(d => d.value));
  const max = Math.max(...riskData.map(d => d.value));
  const startColor = hexToRgb(RISK_LOW_COLOR);
  const endColor = hexToRgb(RISK_HIGH_COLOR);

  const colorProperty = riskData.reduce((acc, rd) => {
    acc.push(rd.iso3);
    const progress = getProgress(rd.value, min, max);
    const color = rgbToHex(interpolateColor(startColor, endColor, progress));
    acc.push(color);

    return acc;
  }, [
      'match',
      ['get', 'iso3'],
  ]);

  colorProperty.push(COLOR_LIGHT_GREY);

  if (colorProperty.length >= 4) {
    map.setPaintProperty(
      'admin-0',
      'fill-color',
      colorProperty,
    );
  }

  return null;
}

export default Choropleth;
