import {
  CountryMini,
  DistrictMini,
} from './country';

export interface Disaster {
  id: number;
  name: string;
  summary: string;
}

export interface Event {
  id: number;
  name: string;
}

export interface EventMini {
  id: number;
  name: string;
  dtype: Disaster;
  slug: string | null;
  auto_generated_source: string | null;
}

export interface ProjectFormFields {
  actual_expenditure: number;
  budget_amount: number;
  dtype: number;
  end_date: string;
  event: number | null;
  name: string;
  operation_type: number;
  primary_sector: number;
  programme_type: number;
  project_country: number;
  project_districts: number[];
  reached_female: number | null;
  reached_male: number | null;
  reached_other: number | null;
  reached_total: number | null;
  reporting_ns: number;
  secondary_sectors: number[];
  start_date: string;
  status: number;
  target_female: number | null;
  target_male: number | null;
  target_other: number | null;
  target_total: number | null;
  visibility: string;
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
  project_districts_detail: DistrictMini[];
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
