interface GeoFeature {
  type: string;
  coordinates: number[]
}

export const RECORD_TYPE_COUNTRY = 1;
export const RECORD_TYPE_CLUSTER = 2;
export const RECORD_TYPE_REGION = 3;

export interface Country {
  bbox: GeoFeature;
  centroid: GeoFeature;
  fdrs: string;
  id: number;
  independent: boolean;
  is_deprecated: boolean;
  iso: string | null;
  iso3: string | null;
  key_priorities: string;
  name: string;
  record_type: number;
  record_type_display: string;
  region: number | null;
  society_name: string;
  society_url: string;
  url_ifrc: string;
}

export type CountryMini = Pick<
  Country,
  'fdrs'
    | 'id'
    | 'independent'
    | 'is_deprecated'
    | 'iso'
    | 'iso3'
    | 'name'
    | 'record_type'
    | 'record_type_display'
    | 'region'
    | 'society_name'
>

export interface District {
  code: string;
  id: number;
  is_deprecated: boolean;
  is_enclave: boolean;
  name: string;
}

export interface Region {
  name: number;
  id: number;
  region_name: string;
  label: string;
  bbox: GeoFeature;
}

interface Disaster {
  id: number;
  name: string;
  summary: string;
}

interface Event {
}

export interface Project {
  actual_expenditure: number;
  budget_amount: number;
  dtype: number;
  dtype_detail: Disaster;
  end_date: string;
  event: number | null;
  event_detail: Event | null;
  id: number;
  modified_at: string;
  name: string;
  operation_type: number;
  operation_type_display: string;
  primary_sector: number;
  primary_sector_display: string;
  programme_type: number;
  programme_type_display: string;
  project_country: number;
  project_country_detail: CountryMini;
  project_districts: number[];
  project_districts_detail: District[];
  reached_female: number | null;
  reached_male: number | null;
  reached_other: number | null;
  reached_total: number | null;
  regional_project: null;
  regional_project_detail: null;
  reporting_ns: number;
  reporting_ns_detail: CountryMini;
  secondary_sectors: number[];
  secondary_sectors_display: string[];
  start_date: string;
  status: number;
  status_display: string;
  target_female: number | null;
  target_male: number | null;
  target_other: number | null;
  target_total: number | null;
  user: number;
  visibility: string;
  visibility_display: string;
}
