import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MapChildContext } from '@togglecorp/re-map';
import { IoChevronForward } from 'react-icons/io5';
import { isDefined } from '@togglecorp/fujs';
import mapboxgl from 'mapbox-gl';

import { COLOR_LIGHT_GREY } from '#utils/map';
import {
  RISK_HIGH_COLOR,
  RISK_LOW_COLOR,
} from '../../common';
import styles from './styles.module.scss';

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

interface HazardProps {
  hazard_type?:string;
  hazard_type_display?: string;
  value: number;
}
interface RegionsProps {
  byHazard?: HazardProps[];
  countryName?: string;
  value?: number;
}
function PopUp (props: RegionsProps) {
  const {
    byHazard,
    countryName,
  } = props;

  const getHazardStatus =(hazardValue: number)=>{
    if(hazardValue > 0 && hazardValue < 25) {
      return 'very low';
    }

    if(hazardValue > 25 && hazardValue < 50) {
      return 'medium';
    }

    if(hazardValue >= 50 && hazardValue < 75) {
      return 'high';
    }

    if(hazardValue >= 75 && hazardValue <= 100) {
      return 'very high';
    }else {
      return 'low';
    }
  };

  return (
    <div className={styles.tooltip}>
      <div className={styles.heading}>
        {countryName}
        <span><IoChevronForward className={styles.icon} /></span>
      </div>
      <div className={styles.subContent}>
        {byHazard?.map(( hd) => (
          <React.Fragment key={hd.hazard_type_display}>
            <div
              key={hd.hazard_type}
              className={styles.hazard}
            >
              <a href="">{hd?.hazard_type_display}</a>
              <div className={styles.hazardStatus}>Risk: {getHazardStatus(hd.value)}</div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
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

  const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
  });

  if (colorProperty.length >= 4) {
    map.setPaintProperty(
      'admin-0',
      'fill-color',
      colorProperty,
    );

    map.on('click','admin-0', (e)=>{
      map.getCanvas().style.cursor = 'pointer';

      const activeCountryIso3 = isDefined(e.features) && e?.features[0]?.properties?.iso3;
      const activeCountryDetails = riskData.find(
        (risk)=> risk.iso3 === activeCountryIso3
      );

      if(e && isDefined(activeCountryDetails)){
        const popupRender = ReactDOMServer.renderToString(PopUp(activeCountryDetails));
        popup.setLngLat(e.lngLat).setHTML(popupRender).addTo(map);
      }
    });
  }

  return null;
}

export default Choropleth;

