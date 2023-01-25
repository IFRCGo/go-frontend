export type HazardTypes = 'DR' | 'FL' | 'TC' | 'FI';
export type ImminentHazardTypes = 'EQ' | 'FL' | 'CY' | 'TC' | 'SS' | 'DR';

interface ExposureObject {
  value: number;
  valueFormatted: string;
  valueFormattedNoTrunc: string;
}

export interface PDCEvent {
  created_at: string;
  description: string | null;
  end_date: string | null;
  hazard_id: string;
  hazard_name: string;
  hazard_type: ImminentHazardTypes;
  id: number;
  latitude: number;
  longitude: number;
  pdc_created_at: string | null;
  pdc_updated_at: string | null;
  severity: 'warning' | 'watch' | 'advisory' | 'information' | null;
  severity_display: string | null;
  start_date: string | null;
  status: string;
  status_display: string;
  uuid: string;
}

export interface PDCEventExposure {
  footprint_geojson: GeoJSON.Feature<GeoJSON.Polygon, { type_id: string }> | null;
  storm_position_geojson: GeoJSON.Feature<GeoJSON.Point, {
    forecast_date_time: string;
    severity: string;
    storm_name: string;
    track_heading: string;
    wind_speed_mph: number;
  }>[] | null;
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
  } | null;
  capital_exposure: {
    hospital: ExposureObject;
    school: ExposureObject;
    total: ExposureObject;
  } | null;
}

export interface ImminentResponse {
  oddrin_data: unknown[];
  pdc_data: PDCEvent[];
}

export interface ADAMEvent {
  id: number;
  hazard_type: ImminentHazardTypes;
  hazard_type_display: string;
  title: string;
  event_id: string;
  publish_date: string;
  country: number | null;
  country_details: {
    id: number;
    iso: string;
    iso3: string;
    name: string;
    region: number;
    regions_details: {
      id: number;
      name_display: string;
      name: number;
    }
  } | null;
  event_details: {
    event_id: string;
    mag: number;
    mmni: number;
    url: {
      map: string;
      shakemap: string;
      population: string;
    }
    iso3: string;
    depth: number;
    place: string;
    title: string;
    latitude: number;
    mag_type: string;
    admin1_name: string;
    longitude: number;
    alert_sent: boolean;
    published_at: string;
    population_impact: number;
    country: number | null;
  }
  geojson: GeoJSON.Feature<GeoJSON.Point>[] | null;
  footprint_geojson: GeoJSON.Feature<GeoJSON.Polygon, { type_id: string }> | null;
  storm_position_geojson: GeoJSON.Feature<GeoJSON.Point, {
    forecast_date_time: string;
    severity: string;
    storm_name: string;
    track_heading: string;
    wind_speed_mph: number;
  }>[] | null;
}
export interface ImminentResponseAdam {
  results: ADAMEvent[];
}
