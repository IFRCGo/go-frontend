import {
  COLOR_WHITE,
  COLOR_BLACK,
  CIRCLE_RADIUS_EXTRA_LARGE,
} from '#utils/map';

import earthquakeIcon from '../icons/earthquake.png';
import cycloneIcon from '../icons/cyclone.png';
import stormSurgeIcon from '../icons/storm-surge.png';
import floodIcon from '../icons/flood.png';


export type ImminentHazardTypes = 'EQ' | 'FL' | 'CY' | 'TC' | 'SS';

export interface HazardData {
  id: number;
  hazardType: ImminentHazardTypes;
  hazardTypeDisplay: string;
  hazardTitle: string;
  latitude: number;
  longitude: number;
  peopleExposed: number | null;
  peopleDisplaced: number | null;
  buildingsExposed: number | null;
  fileType: 'raster' | 'vector' | null;
  mapboxLayerId: string | null;
  description: string;
  startDate: string;
  source: 'pdc' | 'oddrin';
}

export interface ODDRINExposure {
  buildings_exposed: number;
  created_at: string;
  created_by: number | null;
  file: number;
  file_details: {
    id: number;
    file: string;
  }
  glide_number?: string;
  hazard_title: string;
  hazard_type: ImminentHazardTypes;
  hazard_type_display: string;
  id: number;
  iso3: string;
  latitude: number;
  longitude: number;
  modified_at: string | null;
  modified_by:  string | null;
  people_displaced: number;
  people_exposed: number;
  mapbox_layer_id: string;
  file_type: string;
  source_type: 'ODDRIN' | 'PDC';
  uuid?: string;
}

interface ExposureObject {
  value: number;
  valueFormatted: string;
  valueFormattedNoTrunc: string;
}

export interface PDCExposure {
  id: number;
  hazard_type_display: string;
  country_details: {};
  pdc_details: {
    id: number;
    hazard_id: string;
    hazard_name: string;
    hazard_type: ImminentHazardTypes;
    latitude: number;
    longitude: number;
    uuid: string;
    description: string;
    start_date: string;
    end_date: string;
    features: GeoJSON.Feature<GeoJSON.Polygon, { type_id: string }>;
  }
  hazard_type: ImminentHazardTypes;
  population_exposure: {
    households: ExposureObject;
    total: ExposureObject;
    total0_4: ExposureObject;
    total0_14: ExposureObject;
    total5_9: ExposureObject;
    total10_14: ExposureObject;
    total15_19: ExposureObject;
    total15_64: ExposureObject;
    total20_24: ExposureObject;
    total25_29: ExposureObject;
    total30_34: ExposureObject;
    total35_39: ExposureObject;
    total40_44: ExposureObject;
    total45_49: ExposureObject;
    total50_54: ExposureObject;
    total55_59: ExposureObject;
    total60_64: ExposureObject;
    total65_69: ExposureObject;
    total65_Plus: ExposureObject;
    total70_74: ExposureObject;
    total75_79: ExposureObject;
    total80_84: ExposureObject;
    total85_89: ExposureObject;
    total90_94: ExposureObject;
    total95_99: ExposureObject;
    total100AndOver: ExposureObject;
    vulnerable: ExposureObject;
  };
  capital_exposure: {
    hospital: ExposureObject;
    school: ExposureObject;
    total: ExposureObject;
  };
  country: number;
}

export interface ImminentResponse {
  oddrin_data: ODDRINExposure[];
  pdc_data: PDCExposure[];
}

export interface PointGeoJsonProps {
  type: ImminentHazardTypes;
  title: string;
  hazardId: number;
}

export const pointImageOptions = {
    sdf: true,
};

export const hiddenLayout: mapboxgl.LineLayout = {
  visibility: 'none',
};

export const iconPaint: mapboxgl.SymbolPaint = {
  'icon-color': COLOR_BLACK,
  'icon-opacity': 0.5,
};

export const pointCirclePaint: mapboxgl.CirclePaint = {
  'circle-color': COLOR_WHITE,
  'circle-radius': CIRCLE_RADIUS_EXTRA_LARGE,
  'circle-opacity': 0.7,
  'circle-stroke-color': COLOR_BLACK,
  'circle-stroke-width': 1,
  'circle-stroke-opacity': 0.5,
};

export const hazardTypeToIconMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ImminentHazardTypes]: string;
} = {
  EQ: earthquakeIcon,
  TC: cycloneIcon,
  CY: cycloneIcon,
  SS: stormSurgeIcon,
  FL: floodIcon,
};

export const geoJsonSourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};


