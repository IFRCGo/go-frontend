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

export interface GlobalExposureData {
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
  }
  hazard_type: ImminentHazardTypes;
  population_exposure: number;
  capital_exposure: number;
  country: number;
}
